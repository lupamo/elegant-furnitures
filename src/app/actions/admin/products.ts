'use server'
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { success, z } from "zod"

const ProductSchema = z.object({
	name: z.string().min(3, "Product name must be at least 3 characters"),
	description: z.string().min(10, "Description must be at least 10 characters"),
	price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
		message: "Price must be a positive number",
	}),
	stock: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >=0, {
		message: "Stock must be a non-negative number",
	}),
	category: z.string().min(2, "Category is required"),
	images: z.array(z.url({ message: "Invalid image URL" })).min(1, "At least one image URL is required"),
})

async function verifyAdmin() {
	const session = await auth()
	if (!session?.user || session.user.role !== "ADMIN") {
		throw new Error("Unauthorized: Admin access required")
	}
	return session.user
}

//product creation
export async function createProduct(formData: FormData) {
	try {
		await verifyAdmin()
		
		let images: string[] = []
		const imagesData = formData.get('images')
		if (typeof imagesData === 'string') {
			images = JSON.parse(imagesData)
		}
		const validatedFields = ProductSchema.safeParse({
			name: formData.get('name'),
			description: formData.get('description'),
			price: formData.get('price'),
			stock: formData.get('stock'),
			category: formData.get('category'),
			images,
		})
		if (!validatedFields.success) {
			return{
				error: validatedFields.error.issues[0].message
			}
		}
		const { name, description, price, stock, category, images: validatedImages } = validatedFields.data

		await prisma.product.create({
			data: {
				name,
				description,
				price: Number(price),
				stock: Number(stock),
				category,
				images: validatedImages,
			}
		})
		revalidatePath("/admin/products")
		revalidatePath("/products")

		return { success: true, message: "Product created successfully" }
	} catch (error) {
		return { error: error instanceof Error ? error.message : "Failed to create product" }
	}
}

//update product
export async function updateProduct(productId: string, formData: FormData) {
	try {
		await verifyAdmin()

		let images: string[] = []
		const imagesData = formData.get('images')
		if (typeof imagesData === 'string') {
			images = JSON.parse(imagesData)
		}

		const validatedFields = ProductSchema.safeParse({
			name: formData.get('name'),
			description: formData.get('description'),
			price: formData.get('price'),
			stock: formData.get('stock'),
			category: formData.get('category'),
			images,
		})

		if (!validatedFields.success) {
			return {
				error: validatedFields.error.issues[0].message
			}
		}

		const { name, description, price, stock, category, images: validatedImages } = validatedFields.data

		await prisma.product.update({
			where: { id: productId },
			data: {
				name,
				description,
				price: Number(price),
				stock: Number(stock),
				category,
				images: validatedImages,
			}
		})

		revalidatePath("/admin/products")
		revalidatePath("/products")
		revalidatePath(`/products/${productId}`)

		return { success: true, message: "Product updated successfully" }
	} catch (error) {
		return { error: error instanceof Error ? error.message : "Failed to update product" }
	}
}

//delete product
export async function deleteProduct(productId: string) {
  try {
    await verifyAdmin()

    await prisma.product.delete({
      where: { id: productId }
    })

    revalidatePath('/admin/products')
    revalidatePath('/products')
    
    return { success: true, message: "Product deleted successfully" }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to delete product" }
  }
}

// Get all products (admin view)
export async function getAllProducts() {
  try {
    await verifyAdmin()

    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return { products }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to fetch products" }
  }
}

// Get single product
export async function getProduct(productId: string) {
  try {
    await verifyAdmin()

    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return { error: "Product not found" }
    }

    return { product }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to fetch product" }
  }
}

