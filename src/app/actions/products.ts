'use server'

import prisma from "@/lib/prisma"

//get all products
export async function getProducts(filters?: {
	category?: string
	minPrice?: number
	maxPrice?: number
	search?: string
}) {
	try {
		const where: any = {}

		if (filters?.minPrice || filters?.maxPrice){
			where.price = {}
			if (filters.minPrice) {
				where.price.gte = filters.minPrice
			}
			if (filters.maxPrice) {
				where.price.lte = filters.maxPrice
			}
		}
		if (filters?.search) {
			where.OR = [
				{ name: { contains: filters.search, mode: 'insensitive' } },
				{ description: { contains: filters.search, mode: 'insensitive' } },
			]
		}

		const products = await prisma.product.findMany({
			where,
			orderBy: { createdAt: 'desc' }
		})
		return { products }
	} catch (error) {
		return { error: "Failed to fetch products" }
	}
}

//get single product details
export async function getProductById(productId: string) {
	try {
		const product = await prisma.product.findUnique({
			where: { id: productId }
		})
		if (!product) {
			return { error: "Product not found" }
		}
		return { product }
	} catch (error) {
		return { error: "Failed to fetch product" }
	}
} 

//featured products
export async function getFeaturedProducts(limit: number = 4) {
	try {
		const products = await prisma.product.findMany({
			take: limit,
			orderBy: { createdAt: 'desc' }

		})
		return { products }
	} catch (error) {
		return { error: "Failed to fetch featured products" }
	}
}

//get products by category
export async function getProductsByCategory(category: string) {
	try {
		const products = await prisma.product.findMany({
			where: { category },
			orderBy: { createdAt: 'desc'}
		})
		return { products }
	} catch (error) {
		return { error: "Failed to fetch products by category" }
	}
}

//get all unique categories
export async function getCategories() {
  try {
    const products = await prisma.product.findMany({
      select: { category: true },
      distinct: ['category']
    })

    const categories = products.map(p => p.category)

    return { categories }
  } catch (error) {
    return { error: "Failed to fetch categories" }
  }
}
