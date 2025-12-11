'use server'

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// check user authentication
async function verifyUser() {
  const session = await auth()
  if (!session?.user) {
    throw new Error("Unauthorized: Please log in")
  }
  return session.user
}

// Create new order
export async function createOrder(cartItems: { productId: string; quantity: number }[]) {
  try {
    const user = await verifyUser()

    if (!cartItems || cartItems.length === 0) {
      return { error: "Cart is empty" }
    }

    // Fetch product details and calculate total
    const products = await prisma.product.findMany({
      where: {
        id: { in: cartItems.map(item => item.productId) }
      }
    })

    // Check stock availability
    for (const item of cartItems) {
      const product = products.find(p => p.id === item.productId)
      if (!product) {
        return { error: `Product not found: ${item.productId}` }
      }
      if (product.stock < item.quantity) {
        return { error: `Insufficient stock for ${product.name}` }
      }
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId)!
      return sum + (Number(product.price) * item.quantity)
    }, 0)

    // Create order with items
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount,
        status: "PENDING",
        items: {
          create: cartItems.map(item => {
            const product = products.find(p => p.id === item.productId)!
            return {
              productId: item.productId,
              quantity: item.quantity,
              price: product.price
            }
          })
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    // Update product stock
    for (const item of cartItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      })
    }

    revalidatePath('/orders')
    
    return { success: true, orderId: order.id, message: "Order placed successfully" }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to create order" }
  }
}

// Get user's orders
export async function getMyOrders() {
  try {
    const user = await verifyUser()

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return { orders }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to fetch orders" }
  }
}

// Get single order details (user must own the order)
export async function getMyOrder(orderId: string) {
  try {
    const user = await verifyUser()

    const order = await prisma.order.findFirst({
      where: { 
        id: orderId,
        userId: user.id
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    if (!order) {
      return { error: "Order not found" }
    }

    return { order }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to fetch order" }
  }
}

// Cancel order (only if status is PENDING)
export async function cancelMyOrder(orderId: string) {
  try {
    const user = await verifyUser()

    const order = await prisma.order.findFirst({
      where: { 
        id: orderId,
        userId: user.id
      },
      include: {
        items: true
      }
    })

    if (!order) {
      return { error: "Order not found" }
    }

    if (order.status !== "PENDING") {
      return { error: "Only pending orders can be cancelled" }
    }

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" }
    })

    // Restore product stock
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: item.quantity
          }
        }
      })
    }

    revalidatePath('/orders')
    
    return { success: true, message: "Order cancelled successfully" }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to cancel order" }
  }
}
