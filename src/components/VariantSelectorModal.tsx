import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { ProductVariant } from "@/data/products";
import type { Product } from "@/context/ShopContext";

interface VariantSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  onConfirm: (selectedVariant: ProductVariant | null) => void;
}

export function VariantSelectorModal({
  open,
  onOpenChange,
  product,
  onConfirm,
}: VariantSelectorModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    product.variants && product.variants.length > 0 ? product.variants[0].id : null
  );

  const handleConfirm = () => {
    if (product.variants && product.variants.length > 0) {
      const variant = product.variants.find((v) => v.id === selectedVariant);
      onConfirm(variant || null);
    } else {
      onConfirm(null);
    }
    onOpenChange(false);
  };

  // Jika produk tidak memiliki varian, langsung tambahkan ke cart
  if (!product.variants || product.variants.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Pilih Varian - {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product image preview */}
          <div className="flex justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="h-32 w-32 object-cover rounded-lg"
            />
          </div>

          {/* Variant selection */}
          <div className="space-y-3">
            <p className="font-display font-semibold text-foreground">
              Pilih Varian:
            </p>
            <RadioGroup value={selectedVariant || ""} onValueChange={setSelectedVariant}>
              <div className="space-y-2">
                {product.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="flex items-center space-x-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <RadioGroupItem value={variant.id} id={variant.id} />
                    <Label
                      htmlFor={variant.id}
                      className="flex-1 cursor-pointer font-body"
                    >
                      <div className="font-medium text-foreground">
                        {variant.name}
                      </div>
                      {variant.priceModifier !== undefined &&
                        variant.priceModifier !== 0 && (
                          <div className="text-xs text-muted-foreground">
                            {variant.priceModifier > 0 ? "+" : ""}
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                            }).format(variant.priceModifier)}
                          </div>
                        )}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Price calculation */}
          <div className="space-y-2 rounded-lg bg-muted/30 p-3">
            <p className="text-sm text-muted-foreground">Harga Total:</p>
            <p className="font-display text-lg font-bold text-foreground">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(
                product.price +
                  ((product.variants?.find((v) => v.id === selectedVariant)
                    ?.priceModifier || 0) ?? 0)
              )}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Tambah ke Keranjang
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
