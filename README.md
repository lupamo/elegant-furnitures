# Furniture E-commerce Platform

This is a full-stack, type-safe e-commerce application built for browsing and buying furnitures. This project features a dual-interface system: a storeftont for customers and a secure dashbooard for administrators to manage inventory and fulfillment.

## Tech Stack
- FrameWork: Nextjs 15
- Language: Typescript
- Database: PostgreSQL
- ORM: Prisma
- Styling: Tailwind CSS
- Authentication: NextAuth.js
- Payment (planned) Mpesa

## Features
### Customer StoreFront
Product Browsing: Filter furniture by category, price, and specifications.
User Accounts: Secure registration and login.
Shopping Cart: Persistent cart state.
Order Tracking: Users can view the real-time status of their orders (e.g., Processing → Shipped).

### AdminDashboard
Role-Based Access Control: Middleware protection ensures only users with the ADMIN role can access /admin.
Product Management: Create, update, and delete furniture listings.
Order Fulfillment: View incoming orders and update their status (e.g., mark as Delivered).
Customer Insights: View registered users and order history.

