'use server'

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { OrderStatus } from "@prisma/client"

//verifying admin
async function verifyAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required")
  }
  return session.user
}

// Get all orders
export async function getAllOrders() {
  try {
    await verifyAdmin()

    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          }
        },
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

// Get single order details
export async function getOrder(orderId: string) {
  try {
    await verifyAdmin()

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            address: true,
          }
        },
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

// Update order status
export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
  try {
    await verifyAdmin()

    const validStatuses: OrderStatus[] = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]
    if (!validStatuses.includes(newStatus)) {
      return { error: "Invalid order status" }
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus }
    })

    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${orderId}`)
    
    return { success: true, message: `Order status updated to ${newStatus}`, order }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to update order status" }
  }
}

// Get order statistics (dashboard)
export async function getOrderStats() {
  try {
    await verifyAdmin()

    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "PROCESSING" } }),
      prisma.order.count({ where: { status: "SHIPPED" } }),
      prisma.order.count({ where: { status: "DELIVERED" } }),
      prisma.order.count({ where: { status: "CANCELLED" } }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { not: "CANCELLED" } }
      })
    ])

    return {
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to fetch statistics" }
  }
}