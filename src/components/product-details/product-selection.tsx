// import { Star } from "lucide-react";
// import { Label } from "../ui/label";
// import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
// import { SizeSelector } from "./size-selector";

// export const ProductSelection=()=>{
//     return(
//         <div className="space-y-5">
//                   <div>
//                     <h1 className="text-2xl font-bold mb-1">{product.name}</h1>
//                     <div className="flex items-center space-x-3 mb-3">
//                       <div className="flex items-center">
//                         {[...Array(5)].map((_, i) => (
//                           <Star
//                             key={i}
//                             className={`h-4 w-4 ${
//                               i < Math.floor(Number(rating))
//                                 ? "fill-yellow-400 text-yellow-400"
//                                 : "fill-muted text-muted-foreground"
//                             }`}
//                           />
//                         ))}
//                         <span className="ml-1 text-sm text-muted-foreground">
//                           {rating} ({reviews} reviews)
//                         </span>
//                       </div>
//                     </div>

//                     <div className="flex items-center space-x-3 mb-4">
//                       {discountPercentage > 0 ? (
//                         <>
//                           <span className="text-2xl font-bold">
//                             ₹{discountedPrice.toFixed(2)}
//                           </span>
//                           <span className="text-lg text-muted-foreground line-through">
//                             ₹{product.price}
//                           </span>
//                           <Badge className="bg-red-500">
//                             {discountPercentage}% OFF
//                           </Badge>
//                         </>
//                       ) : (
//                         <span className="text-2xl font-bold">₹{product.price}</span>
//                       )}
//                     </div>
//                   </div>

//                   <p className="text-muted-foreground text-sm">{product.description}</p>

//                   {/* Color Selection */}
//                   <div>
//                     <Label className="text-sm font-medium mb-2 block">Color</Label>
//                     <RadioGroup
//                       value={selectedColor}
//                       onValueChange={setSelectedColor}
//                       className="flex flex-wrap gap-2"
//                     >
//                       {product.inventory.map((color) => (
//                         <div key={color.colorId}>
//                           <RadioGroupItem
//                             value={color.name}
//                             id={`color-${color.colorId}`}
//                             className="peer sr-only"
//                           />
//                           <Label
//                             htmlFor={`color-${color.colorId}`}
//                             className={`flex items-center justify-center px-3 py-1.5 text-sm border rounded-md cursor-pointer ${
//                               selectedColor === color.name
//                                 ? "border-primary bg-primary/10"
//                                 : "hover:border-primary/50"
//                             }`}
//                           >
//                             {color.name}
//                           </Label>
//                         </div>
//                       ))}
//                     </RadioGroup>
//                   </div>

//                   {/* Size Selection */}
//                   {availableSizes.length > 0 && (
//                     <SizeSelector
//                       sizes={availableSizes}
//                       onSizeSelect={(sizeId) => {
//                         const size = availableSizes.find((s) => s.sizeId === sizeId);
//                         if (size) {
//                           setSelectedSize(size.name);
//                         }
//                       }}
//                     />
//                   )}

//                   {/* Quantity */}
//                   <div>
//                     <Label className="text-sm font-medium mb-2 block">Quantity</Label>
//                     <div className="flex items-center space-x-2">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                         disabled={quantity <= 1}
//                       >
//                         <Minus className="h-3 w-3" />
//                       </Button>
//                       <span className="w-10 text-center font-medium">{quantity}</span>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => setQuantity(quantity + 1)}
//                       >
//                         <Plus className="h-3 w-3" />
//                       </Button>
//                     </div>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex flex-col sm:flex-row gap-3 pt-2">
//                     <Button size="sm" className="flex-1 py-2" onClick={handleAddToCart}>
//                       <ShoppingCart className="h-4 w-4 mr-2" />
//                       Add to Cart
//                     </Button>
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       className="flex-1 py-1"
//                       onClick={handleBuyNow}
//                     >
//                       Buy Now
//                     </Button>
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={() => setIsWishlisted(!isWishlisted)}
//                       className={isWishlisted ? "text-red-500 border-red-500" : ""}
//                     >
//                       <Heart
//                         className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`}
//                       />
//                     </Button>
//                   </div>

//                   {/* Features */}
//                   <div className="grid grid-cols-3 gap-3 pt-4">
//                     <div className="flex flex-col items-center text-center">
//                       <Truck className="h-5 w-5 text-primary mb-1" />
//                       <span className="text-xs">Free Shipping</span>
//                     </div>
//                     <div className="flex flex-col items-center text-center">
//                       <RotateCcw className="h-5 w-5 text-primary mb-1" />
//                       <span className="text-xs">Easy Returns</span>
//                     </div>
//                     <div className="flex flex-col items-center text-center">
//                       <Shield className="h-5 w-5 text-primary mb-1" />
//                       <span className="text-xs">Secure Payment</span>
//                     </div>
//                   </div>
//                 </div>
//     )
// }
