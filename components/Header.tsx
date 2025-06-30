import { useState } from "react";
import { Search, ShoppingCart, User } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { useQuery } from "@tanstack/react-query";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: cartItems = [] } = useQuery<any[]>({
    queryKey: ["/api/cart"],
  });

  const cartItemCount = cartItems.reduce((total: number, item: any) => total + item.quantity, 0);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">ModernCommerce</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                Home
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                About
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                Contact
              </a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
            
            <Button className="bg-primary hover:bg-primary/90">
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
