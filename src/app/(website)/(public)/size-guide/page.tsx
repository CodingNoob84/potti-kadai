import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SizeGuide() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-primary mb-8">Size Guide</h1>

      {/* Topwear */}
      <Card className="mb-8 border-secondary">
        <CardHeader>
          <CardTitle className="text-xl text-primary">Topwear</CardTitle>
          <p className="text-sm text-muted-foreground">
            T-Shirts, Shirts, Jackets, etc.
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-secondary/50">
                <TableHead className="text-primary">Size</TableHead>
                <TableHead>IND</TableHead>
                <TableHead>EU</TableHead>
                <TableHead>US</TableHead>
                <TableHead>UK</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                ["XS", "34", "44", "32", "6"],
                ["S", "36", "46", "34", "8"],
                ["M", "38", "48", "36", "10"],
                ["L", "40", "50", "38", "12"],
                ["XL", "42", "52", "40", "14"],
                ["XXL", "44", "54", "42", "16"],
              ].map(([size, ind, eu, us, uk]) => (
                <TableRow key={size} className="hover:bg-secondary/50">
                  <TableCell className="font-medium text-primary">
                    {size}
                  </TableCell>
                  <TableCell>{ind}</TableCell>
                  <TableCell>{eu}</TableCell>
                  <TableCell>{us}</TableCell>
                  <TableCell>{uk}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Bottomwear */}
      <Card className="mb-8 border-secondary">
        <CardHeader>
          <CardTitle className="text-xl text-primary">Bottomwear</CardTitle>
          <p className="text-sm text-muted-foreground">
            Jeans, Trousers, Shorts, etc.
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-secondary/50">
                <TableHead className="text-primary">Size</TableHead>
                <TableHead>IND</TableHead>
                <TableHead>EU</TableHead>
                <TableHead>US</TableHead>
                <TableHead>UK</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                ["XS", "28", "42", "26", "6"],
                ["S", "30", "44", "28", "8"],
                ["M", "32", "46", "30", "10"],
                ["L", "34", "48", "32", "12"],
                ["XL", "36", "50", "34", "14"],
                ["XXL", "38", "52", "36", "16"],
              ].map(([size, ind, eu, us, uk]) => (
                <TableRow key={size} className="hover:bg-secondary/50">
                  <TableCell className="font-medium text-primary">
                    {size}
                  </TableCell>
                  <TableCell>{ind}</TableCell>
                  <TableCell>{eu}</TableCell>
                  <TableCell>{us}</TableCell>
                  <TableCell>{uk}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Freesize */}
      <Card className="mb-8 border-secondary">
        <CardHeader>
          <CardTitle className="text-xl text-primary">Freesize</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            One Size Fits All – Suitable for most body types
          </p>
        </CardContent>
      </Card>

      {/* Footwear */}
      <Card className="border-secondary">
        <CardHeader>
          <CardTitle className="text-xl text-primary">Footwear</CardTitle>
          <p className="text-sm text-muted-foreground">Shoes, Sneakers, etc.</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-secondary/50">
                <TableHead className="text-primary">Size</TableHead>
                <TableHead>IND</TableHead>
                <TableHead>EU</TableHead>
                <TableHead>UK</TableHead>
                <TableHead>US</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                ["4", "4", "20", "3", "4"],
                ["5", "5", "21", "4", "5"],
                ["6", "6", "22", "5", "6"],
                ["7", "7", "23", "6", "7"],
                ["8", "8", "24", "7", "8"],
                ["9", "9", "25", "8", "9"],
                ["10", "10", "26", "9", "10"],
                ["11", "11", "27", "10", "11"],
              ].map(([size, ind, eu, uk, us]) => (
                <TableRow key={size} className="hover:bg-secondary/50">
                  <TableCell className="font-medium text-primary">
                    {size}
                  </TableCell>
                  <TableCell>{ind}</TableCell>
                  <TableCell>{eu}</TableCell>
                  <TableCell>{uk}</TableCell>
                  <TableCell>{us}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Measurement Guide */}
      <div className="mt-12 p-6 bg-secondary/20 rounded-lg">
        <h2 className="text-2xl font-bold text-primary mb-4">
          How to Measure?
        </h2>
        <ul className="space-y-2 text-muted-foreground">
          <li>
            <strong>Chest (Topwear):</strong> Measure around the fullest part of
            your chest.
          </li>
          <li>
            <strong>Waist (Bottomwear):</strong> Measure around your natural
            waistline.
          </li>
          <li>
            <strong>Foot Length (Footwear):</strong> Measure from heel to toe
            for accurate sizing.
          </li>
        </ul>
        <p className="mt-4 text-sm text-muted-foreground">
          For any further assistance, please contact our customer support.
        </p>
      </div>
    </div>
  );
}
