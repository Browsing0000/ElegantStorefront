import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Lightbulb, Compass, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import FileUpload from "./FileUpload";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { PrototypingProject } from "@shared/schema";

const formSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  budgetRange: z.string().optional(),
  timeline: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, "You must accept the terms")
});

export default function PrototypingSection() {
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      category: "",
      description: "",
      budgetRange: "",
      timeline: "",
      acceptTerms: false
    }
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["/api/prototyping"],
  });

  const submitProjectMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'acceptTerms') {
          formData.append(key, value as string);
        }
      });
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('/api/prototyping', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to submit project');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Project submitted",
        description: "Your prototyping project has been submitted successfully. We'll contact you soon!",
      });
      form.reset();
      setFiles([]);
    },
    onError: () => {
      toast({
        title: "Submission failed",
        description: "Failed to submit your project. Please try again.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    submitProjectMutation.mutate(data);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="gradient-secondary rounded-2xl p-8 text-white">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-4">Professional Prototyping Services</h2>
            <p className="text-lg mb-6 text-purple-100">
              Transform your ideas into reality with our expert prototyping team. From concept to working prototype in record time.
            </p>
            <Button variant="secondary" size="lg" className="bg-white text-secondary hover:bg-gray-100">
              Start Project
            </Button>
          </div>
          <div className="hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              alt="Professional prototyping workshop"
              className="rounded-xl shadow-lg w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            icon: Lightbulb,
            title: "Concept Development",
            description: "Transform your ideas into detailed concepts with our expert consultation and design process.",
            color: "text-secondary"
          },
          {
            icon: Compass,
            title: "Technical Design",
            description: "Create detailed technical specifications and engineering drawings for your prototype.",
            color: "text-secondary"
          },
          {
            icon: Wrench,
            title: "Rapid Prototyping",
            description: "Build functional prototypes quickly using cutting-edge manufacturing techniques.",
            color: "text-secondary"
          }
        ].map((service, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <service.icon className={`${service.color} text-xl`} />
              </div>
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <Button variant="link" className="text-secondary p-0">
                Learn More →
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Project Submission Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Submit Your Project</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="projectName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your project name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Category *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="mechanical">Mechanical</SelectItem>
                          <SelectItem value="software">Software</SelectItem>
                          <SelectItem value="industrial">Industrial Design</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="Describe your project goals, requirements, and specifications..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="budgetRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget Range</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                          <SelectItem value="10000-25000">$10,000 - $25,000</SelectItem>
                          <SelectItem value="25000-50000">$25,000 - $50,000</SelectItem>
                          <SelectItem value="50000+">$50,000+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timeline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timeline</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timeline" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1-2weeks">1-2 weeks</SelectItem>
                          <SelectItem value="2-4weeks">2-4 weeks</SelectItem>
                          <SelectItem value="1-3months">1-3 months</SelectItem>
                          <SelectItem value="3months+">3+ months</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Files</label>
                <FileUpload
                  onFilesChange={setFiles}
                  allowedTypes={['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png']}
                  maxSize={10 * 1024 * 1024} // 10MB
                  description="Supports: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max 10MB each)"
                />
              </div>

              <div className="flex items-center justify-between pt-6">
                <FormField
                  control={form.control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm text-gray-600">
                          I agree to the{" "}
                          <a href="#" className="text-secondary hover:underline">
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a href="#" className="text-secondary hover:underline">
                            Privacy Policy
                          </a>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={submitProjectMutation.isPending}
                  className="bg-secondary hover:bg-secondary/90"
                >
                  {submitProjectMutation.isPending ? "Submitting..." : "Submit Project"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Recent Projects Gallery */}
      <div>
        <h3 className="text-2xl font-bold mb-6">Recent Prototyping Projects</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
            "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
            "https://images.unsplash.com/photo-1586473219010-2ffc57b0d282?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
            "https://images.unsplash.com/photo-1604754742629-3e5728249d73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
          ].map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Prototyping project ${index + 1}`}
              className="rounded-lg shadow-sm w-full h-40 object-cover hover:shadow-md transition-shadow"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
