import { renderHook, act } from "@testing-library/react";
import { ShopProvider, useShop } from "@/context/ShopContext";

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ShopProvider>{children}</ShopProvider>
);

// menguji logika pemfilteran di ShopContext

describe("ShopContext filtering", () => {
  it("returns all products initially", () => {
    const { result } = renderHook(() => useShop(), { wrapper });
    expect(result.current.filteredProducts.length).toBe(result.current.products.length);
  });

  it("filters products by search query (nama atau deskripsi)", () => {
    const { result } = renderHook(() => useShop(), { wrapper });
    act(() => {
      result.current.setSearchQuery("latte");
    });
    const q = "latte";
    expect(result.current.filteredProducts.every((p) =>
      p.name.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    )).toBe(true);
  });
});