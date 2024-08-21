import React, { useState, useEffect } from 'react';
import { Button, TextField, Modal, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper, Select, MenuItem, Checkbox, ListItemText } from '@mui/material';
import { getProducts, addProduct, editProduct, deleteProduct } from '../../services/products';
import FallbackSpinner from 'src/@core/components/spinner';
import { getCategories } from '../../services/categories';
import { useAuth } from 'src/hooks/useAuth';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    price: number | string | any;
    registration_date: string;
    categories: Category[];
}

const Products = () => {
    const auth = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        registration_date: '',
        category_ids: [] as number[],
    });
    const [categoryError, setCategoryError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchProducts();
        fetchCategories();
    }, []);

    const handleAddProduct = async () => {
        setCategoryError(null);

        if (categories.length === 0) {
            setCategoryError('Cadastre algumas categorias.');

            return;
        }
        if (newProduct.category_ids.length === 0) {
            setCategoryError('Marque uma categoria.');

            return;
        }

        if (auth.user) {
            try {
                const addedProduct = await addProduct({
                    ...newProduct,
                    price: parseFloat(newProduct.price),
                    user_id: auth.user.id,
                });
                setProducts([...products, addedProduct]);
                setNewProduct({ name: '', price: '', registration_date: '', category_ids: [] });
                setIsModalOpen(false);
            } catch (error) {
                console.error('Error ao adicionar produto:', error);
            }
        }
    };

    const handleEditProduct = async () => {
        if (selectedProduct && auth.user) {
            try {
                const updatedProductData = {
                    name: selectedProduct.name,
                    registration_date: selectedProduct.registration_date,
                    price: parseFloat(selectedProduct.price),
                    user_id: auth.user.id,
                    category_ids: selectedProduct.categories.map(cat => cat.id),
                    categories: []
                };

                const updatedProduct = await editProduct(selectedProduct.id, updatedProductData);
                setProducts(products.map(prod => (prod.id === updatedProduct.id ? updatedProduct : prod)));
                setSelectedProduct(null);
                setIsModalOpen(false);
            } catch (error) {
                console.error('Error ao editar produto:', error);
            }
        }
    };

    const handleDeleteProduct = async (id: number) => {
        try {
            await deleteProduct(id);
            setProducts(products.filter(prod => prod.id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    return (
        <div className="p-4">
            {loading ? (
                <FallbackSpinner />
            ) : (
                <>
                    <Button
                        onClick={() => {
                            setNewProduct({ name: '', price: '', registration_date: '', category_ids: [] });
                            setIsModalOpen(true);
                        }}
                        variant="contained"
                        color="primary"
                        style={{ marginBottom: '20px' }}
                    >
                        Add Product
                    </Button>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Categories</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>{product.id}</TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.price}</TableCell>
                                        <TableCell>
                                            {product.categories.map((category) => category.name).join(', ')}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={() => {
                                                    setSelectedProduct(product);
                                                    setIsModalOpen(true);
                                                }}
                                                color="primary"
                                            >
                                                Edit
                                            </Button>
                                            <Button onClick={() => handleDeleteProduct(product.id)} color="secondary">
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                        <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-lg">
                            <h2 className="text-xl font-semibold mb-4">{selectedProduct ? 'Edit Product' : 'Add Product'}</h2>
                            <TextField
                                label="Name"
                                value={selectedProduct ? selectedProduct.name : newProduct.name}
                                onChange={(e) => {
                                    if (selectedProduct) {
                                        setSelectedProduct({ ...selectedProduct, name: e.target.value });
                                    } else {
                                        setNewProduct({ ...newProduct, name: e.target.value });
                                    }
                                }}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Price"
                                type="number"
                                value={selectedProduct ? selectedProduct.price : newProduct.price}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (selectedProduct) {
                                        setSelectedProduct({ ...selectedProduct, price: parseFloat(value) });
                                    } else {
                                        setNewProduct({ ...newProduct, price: value });
                                    }
                                }}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Registration Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={selectedProduct ? selectedProduct.registration_date : newProduct.registration_date}
                                onChange={(e) => {
                                    if (selectedProduct) {
                                        setSelectedProduct({ ...selectedProduct, registration_date: e.target.value });
                                    } else {
                                        setNewProduct({ ...newProduct, registration_date: e.target.value });
                                    }
                                }}
                                fullWidth
                                margin="normal"
                            />
                            <Select
                                multiple
                                value={selectedProduct ? selectedProduct.categories.map(cat => cat.id) : newProduct.category_ids}
                                onChange={(e) => {
                                    const selectedCategoryIds = e.target.value as number[];
                                    if (selectedProduct) {
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            categories: categories.filter(cat => selectedCategoryIds.includes(cat.id))
                                        });
                                    } else {
                                        setNewProduct({ ...newProduct, category_ids: selectedCategoryIds });
                                    }
                                }}
                                renderValue={(selected) => {
                                    const selectedCategories = categories.filter(cat => (selected as number[]).includes(cat.id));

                                    return selectedCategories.map(cat => cat.name).join(', ');
                                }}
                                fullWidth

                            >
                                {categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        <Checkbox checked={(newProduct.category_ids as number[]).includes(category.id)} />
                                        <ListItemText primary={category.name} />
                                    </MenuItem>
                                ))}
                            </Select>
                            {categoryError && <p style={{ color: 'red' }}>{categoryError}</p>}
                            <Button
                                onClick={selectedProduct ? handleEditProduct : handleAddProduct}
                                variant="contained"
                                color="primary"
                                fullWidth
                                style={{ marginTop: '20px' }}
                            >
                                {selectedProduct ? 'Update' : 'Add'}
                            </Button>
                        </div>
                    </Modal>
                </>
            )}
        </div>
    );
};

export default Products;
