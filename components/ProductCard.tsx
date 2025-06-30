import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { formatPrice } from "./lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "./lib/queryClient";
import { useToast } from "./hooks/use-toast";
import type { Product } from "../shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: (productId: string) =>
      apiRequest("POST", "/api/cart", { productId, quantity: 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow group product-card">
      <div className="aspect-square overflow-hidden">
        <img
          src={product.images[0] || 'https://via.placeholder.com/400x300'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          <Button
            onClick={() => addToCartMutation.mutate(product._id || "")}
            disabled={addToCartMutation.isPending || product.stock === 0}
            className="bg-primary hover:bg-primary/90"
          >
            {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
        {product.stock === 0 && (
          <p className="text-red-500 text-sm mt-2">Out of stock</p>
        )}
      </CardContent>
    </Card>
  );
}
