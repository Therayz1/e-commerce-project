import { MetadataRoute } from "next";
import { products } from "@/lib/mock-data";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://styleai.example.com";

    // Base routes
    const routes = ["", "/products", "/cart", "/checkout", "/account", "/style-quiz"].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: "daily" as const,
        priority: route === "" ? 1 : 0.8,
    }));

    // Product dynamic routes
    const productRoutes = products.map((product) => ({
        url: `${baseUrl}/products/${product.id}`,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
    }));

    return [...routes, ...productRoutes];
}
