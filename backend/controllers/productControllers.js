import asyncHandler from "../middlewares/asyncHandler.js";
import axios from "axios";



function sortAndFilterProducts(products, sortBy, order, n) {
    // Sort the products based on the specified criteria
    let sortedProducts = [...products];
    if (sortBy === 'rating') {
      sortedProducts.sort((a, b) => order === 'desc' ? b.rating - a.rating : a.rating - b.rating);
    } else if (sortBy === 'price') {
      sortedProducts.sort((a, b) => order === 'desc' ? b.price - a.price : a.price - b.price);
    } else if (sortBy === 'discount') {
      sortedProducts.sort((a, b) => order === 'desc' ? b.discount - a.discount : a.discount - b.discount);
    } else if (sortBy === 'company') {
      sortedProducts.sort((a, b) => {
        const companyOrder = ['AMZ', 'FLP', 'SNP', 'MYN', 'AZO'];
        const aIndex = companyOrder.indexOf(a.company);
        const bIndex = companyOrder.indexOf(b.company);
        return order === 'desc' ? bIndex - aIndex : aIndex - bIndex;
      });
    }
  
    // Filter the sorted products by the specified number (n)
    const filteredProducts = sortedProducts.slice(0, n);
  
    return filteredProducts;
  }

  const fetchAllProducts = asyncHandler(async (req, res) => {

    
    const categoryName = req.params.categoryname;
    const n = req.query.n || 10;
    const sortBy = req.query.sortBy || 'rating';
    const order = req.query.order || 'desc';
    const page = req.query.page || 1;
    try {


        const companies = ['AMZ', 'FLP', 'SNP', 'MYN', 'AZO'];
        let productData = [];
        const tokenStr=process.env.CONFIG;
        for (const company of companies) {
            const response = await axios.get(`http://20.244.56.144/test/companies/${company}/categories/${categoryName}/products`, {
              headers: {
                Authorization: `Bearer ${tokenStr}`,
              },
            });


      const products =  sortAndFilterProducts(productData, sortBy, order, n);

      // Implement pagination
    const startIndex = (page - 1) * n;
    const endIndex = startIndex + n;
    const paginatedData = productData.slice(startIndex, endIndex);
    
  // Generate unique identifiers
  const productsWithIds = paginatedData.map((product, index) => ({
    ...product,
    id: `${categoryName}-${company}-${index}`,
  }));

      res.json(productsWithIds);
    }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
    }
  });

  export {fetchAllProducts};