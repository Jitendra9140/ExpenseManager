import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/app/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    // Verify category belongs to user
    const category = await prisma.category.findFirst({
      where: {
        id,
        userId: user.id,
      },
    })

    if (!category) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 })
    }

    // Check if category has transactions
    const transactionCount = await prisma.transaction.count({
      where: { categoryId: id },
    })

    if (transactionCount > 0) {
      return NextResponse.json({ message: "Cannot delete category with existing transactions" }, { status: 400 })
    }

    await prisma.category.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Category deleted successfully" })
  } catch (error) {
    console.error("Category deletion error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
