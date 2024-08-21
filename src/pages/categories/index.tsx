import React, { useState, useEffect } from 'react';
import { Button, Input, Modal, Table, TableBody, TableCell, TableHead, TableRow, Box } from '@mui/material';
import FallbackSpinner from 'src/@core/components/spinner';
import { getCategories, addCategory, editCategory, deleteCategory } from '../../services/categories';

// Definição da interface para a categoria
interface Category {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

const Categories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newCategory, setNewCategory] = useState({ name: '' });

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleAddCategory = async () => {
        try {
            const addedCategory = await addCategory(newCategory);
            setCategories([...categories, addedCategory]);
            setNewCategory({ name: '' });
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    const handleEditCategory = async () => {
        try {
            if (selectedCategory) {
                const updatedCategory = await editCategory(selectedCategory.id, selectedCategory);
                setCategories(categories.map(cat => (cat.id === selectedCategory.id ? updatedCategory : cat)));
                setSelectedCategory(null);
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    const handleDeleteCategory = async (id: number) => {
        try {
            await deleteCategory(id);
            setCategories(categories.filter(cat => cat.id !== id));
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const openAddModal = () => {
        setNewCategory({ name: '' });
        setSelectedCategory(null);
        setIsModalOpen(true);
    };

    const openEditModal = (category: Category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const handleModalSubmit = () => {
        if (selectedCategory) {
            handleEditCategory();
        } else {
            handleAddCategory();
        }
    };

    return (
        <Box p={4}>
            {loading ? (
                <FallbackSpinner />
            ) : (
                <>
                    <Button
                        onClick={openAddModal}
                        variant="contained"
                        color="primary"
                        sx={{ mb: 2 }}
                    >
                        Add Category
                    </Button>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nome</TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell>{category.id}</TableCell>
                                    <TableCell>{category.name}</TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={() => openEditModal(category)}
                                            color="primary"
                                            sx={{ mr: 1 }}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            onClick={() => handleDeleteCategory(category.id)}
                                            color="secondary"
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                        <Box
                            p={4}
                            sx={{
                                backgroundColor: 'white',
                                width: 400,
                                margin: '100px auto',
                                borderRadius: 2,
                            }}
                        >
                            <h2>{selectedCategory ? 'Editar Categoria' : 'Adicionar Categoria'}</h2>
                            <Input
                                fullWidth
                                value={selectedCategory ? selectedCategory.name : newCategory.name}
                                onChange={(e) => {
                                    const name = e.target.value;
                                    if (selectedCategory) {
                                        setSelectedCategory({ ...selectedCategory, name });
                                    } else {
                                        setNewCategory({ name });
                                    }
                                }}
                                sx={{ mb: 2 }}
                            />
                            <Button
                                onClick={handleModalSubmit}
                                variant="contained"
                                color="primary"
                            >
                                {selectedCategory ? 'Update' : 'Add'}
                            </Button>
                        </Box>
                    </Modal>
                </>
            )}
        </Box>
    );
};

export default Categories;
