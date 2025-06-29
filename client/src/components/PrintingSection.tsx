import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import FileUpload from "./FileUpload";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";

const formSchema = z.object({
  material: z.string().min(1, "Material is required"),
  quality: z.string().min(1, "Quality is required"),
  infillDensity: z.number().min(10).max(100),
  color: z.string().min(1, "Color is required")
});

interface Quote {
  materialCost: string;
  printTime: string;
  laborCost: string;
  processingFee: string;
  total: string;
  weight: string;
  deliveryTime: string;
  selectedMaterial: string;
}

export default function PrintingSection() {
  const [files, setFiles] = useState<File[]>([]);
  const [quote, setQuote] = useState<Quote | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      material: "PLA",
      quality: "standard",
      infillDensity: 20,
      color: "white"
    }
  });

  const generateQuoteMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      if (files.length === 0) {
        throw new Error("Please upload a 3D model file");
      }

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
      formData.append('file', files[0]);

      const response = await fetch('/api/printing/quote', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to generate quote');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setQuote(data);
      toast({
        title: "Quote generated",
        description: "Your 3D printing quote has been calculated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Quote failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!quote) return;
      
      const formData = new FormData();
      formData.append('file', files[0]);
      formData.append('material', form.getValues('material'));
      formData.append('quality', form.getValues('quality'));
      formData.append('infillDensity', form.getValues('infillDensity').toString());
      formData.append('color', form.getValues('color'));
      formData.append('estimatedCost', quote.total);
      formData.append('estimatedTime', quote.printTime);

      const response = await fetch('/api/printing', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Added to cart",
        description: "Your 3D printing request has been added to the cart.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to add to cart",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    generateQuoteMutation.mutate(data);
  };

  const materials = [
    { value: "PLA", label: "PLA - $0.05/g", description: "Biodegradable, easy to print" },
    { value: "ABS", label: "ABS - $0.07/g", description: "Strong, heat resistant" },
    { value: "PETG", label: "PETG - $0.08/g", description: "Clear, food safe" },
    { value: "Metal", label: "Metal - $2.50/g", description: "Industrial grade" }
  ];

  const colors = [
    { value: "white", color: "bg-white border-2 border-gray-300" },
    { value: "black", color: "bg-black" },
    { value: "red", color: "bg-red-500" },
    { value: "blue", color: "bg-blue-500" },
    { value: "green", color: "bg-green-500" }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="gradient-accent rounded-2xl p-8 text-white">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-4">Advanced 3D Printing Services</h2>
            <p className="text-lg mb-6 text-amber-100">
              Bring your designs to life with our state-of-the-art 3D printing technology. From rapid prototypes to final products.
            </p>
            <Button variant="secondary" size="lg" className="bg-white text-accent hover:bg-gray-100">
              Get Quote
            </Button>
          </div>
          <div className="hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              alt="Advanced 3D printer in operation"
              className="rounded-xl shadow-lg w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Material Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Available Materials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {materials.map((material) => (
              <div key={material.value} className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <div className="w-8 h-8 bg-gray-600 rounded"></div>
                </div>
                <h4 className="font-semibold mb-2">{material.value}</h4>
                <p className="text-sm text-gray-600 mb-2">{material.description}</p>
                <p className="text-sm font-medium text-accent">
                  {material.label.split(' - ')[1]}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upload and Configuration */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Your 3D Model</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUpload
              onFilesChange={setFiles}
              allowedTypes={['.stl', '.obj', '.3mf', '.ply']}
              maxSize={50 * 1024 * 1024} // 50MB
              maxFiles={1}
              description="Supports: STL, OBJ, 3MF, PLY (Max 50MB)"
            />
          </CardContent>
        </Card>

        {/* Print Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Print Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="material"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Material</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {materials.map((material) => (
                            <SelectItem key={material.value} value={material.value}>
                              {material.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quality</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft (0.3mm) - Fastest</SelectItem>
                          <SelectItem value="standard">Standard (0.2mm) - Recommended</SelectItem>
                          <SelectItem value="fine">Fine (0.1mm) - Highest Quality</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="infillDensity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Infill Density: {field.value}%</FormLabel>
                      <FormControl>
                        <Slider
                          min={10}
                          max={100}
                          step={10}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          className="w-full"
                        />
                      </FormControl>
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>10%</span>
                        <span>100%</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <div className="flex space-x-2">
                          {colors.map((colorOption) => (
                            <button
                              key={colorOption.value}
                              type="button"
                              className={`w-8 h-8 rounded cursor-pointer hover:scale-110 transition-transform ${
                                colorOption.color
                              } ${
                                field.value === colorOption.value
                                  ? "ring-2 ring-accent ring-offset-2"
                                  : ""
                              }`}
                              onClick={() => field.onChange(colorOption.value)}
                            />
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={generateQuoteMutation.isPending || files.length === 0}
                  className="w-full bg-accent hover:bg-accent/90"
                >
                  {generateQuoteMutation.isPending ? "Calculating..." : "Generate Quote"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Quote Calculator */}
      {quote && (
        <Card>
          <CardHeader>
            <CardTitle>Instant Quote Calculator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Material Cost:</span>
                  <span className="font-medium">{formatPrice(quote.materialCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Print Time:</span>
                  <span className="font-medium">{quote.printTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Labor Cost:</span>
                  <span className="font-medium">{formatPrice(quote.laborCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee:</span>
                  <span className="font-medium">{formatPrice(quote.processingFee)}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-accent">{formatPrice(quote.total)}</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold mb-4">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Estimated Weight:</span>
                    <span>{quote.weight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Time:</span>
                    <span>{quote.deliveryTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Material:</span>
                    <span>{quote.selectedMaterial}</span>
                  </div>
                </div>
                <Button
                  onClick={() => addToCartMutation.mutate()}
                  disabled={addToCartMutation.isPending}
                  className="w-full bg-accent hover:bg-accent/90 mt-6"
                >
                  {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gallery of 3D Printed Objects */}
      <div>
        <h3 className="text-2xl font-bold mb-6">3D Printing Gallery</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
            "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
            "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
            "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
            "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
          ].map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`3D printing example ${index + 1}`}
              className="rounded-lg shadow-sm w-full h-48 object-cover hover:shadow-md transition-shadow"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
