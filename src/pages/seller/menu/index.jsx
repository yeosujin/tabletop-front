import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    Box,
    Button,
    CircularProgress,
    Container,
    Snackbar,
    Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import {
    createMenu,
    deleteMenu,
    getMenus,
    updateMenu,
} from '../../../apis/seller/MenuAPI'
import MenuList from './list'
import MenuAdd from './add'
import MenuModify from './modify'

const Menu = () => {
    const { loginId, storeId } = useParams()
    const [menuItems, setMenuItems] = useState([])
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        isAvailable: true,
    })
    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [lastMenuId, setLastMenuId] = useState(null)
    const [hasMore, setHasMore] = useState(true)
    const [editingItemId, setEditingItemId] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const fetchMenuItems = useCallback(async () => {
        if (loading || !hasMore || !storeId) return
        setLoading(true)
        try {
            const menus = await getMenus(storeId, lastMenuId, 20)
            setMenuItems((prev) => [...prev, ...menus])
            setLastMenuId(menus[menus.length - 1]?.id)
            setHasMore(menus.length === 20)
        } catch (err) {
            setError('메뉴 항목을 불러오는데 실패했습니다')
        } finally {
            setLoading(false)
        }
    }, [storeId, lastMenuId, loading, hasMore])

    useEffect(() => {
        if (storeId) {
            fetchMenuItems()
        }
    }, [fetchMenuItems, storeId])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === 'isAvailable' ? value === true : value,
        }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImage(file)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        const formDataToSend = new FormData()
        const jsonData = {
            ...formData,
            price: Number(formData.price),
            isAvailable: Boolean(formData.isAvailable),
        }

        formDataToSend.append(
            'menuData',
            new Blob([JSON.stringify(jsonData)], { type: 'application/json' })
        )

        if (image) {
            formDataToSend.append('image', image)
        }

        try {
            let response
            if (editingItemId) {
                response = await updateMenu(
                    storeId,
                    editingItemId,
                    formDataToSend
                )
                setMenuItems((prev) =>
                    prev.map((item) =>
                        item.id === editingItemId ? response : item
                    )
                )
                setShowEditModal(false)
            } else {
                response = await createMenu(storeId, formDataToSend)
                setMenuItems((prev) => [response, ...prev])
                setShowAddModal(false)
            }

            setFormData({
                name: '',
                price: '',
                description: '',
                isAvailable: true,
            })
            setImage(null)
        } catch (error) {
            setError(
                '메뉴 저장에 실패했습니다: ' +
                    (error.response?.data?.message || error.message)
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (itemId) => {
        const itemToDelete = menuItems.find((item) => item.id === itemId)
        if (!itemToDelete) return

        const isConfirmed = window.confirm(
            `'${itemToDelete.name}'을 삭제하시겠습니까?`
        )
        if (!isConfirmed) return

        setIsDeleting(true)
        try {
            await deleteMenu(storeId, itemId)
            setMenuItems((prev) => prev.filter((item) => item.id !== itemId))
            if (editingItemId === itemId) {
                setShowEditModal(false)
                setEditingItemId(null)
            }
        } catch (err) {
            setError('메뉴 항목 삭제에 실패했습니다')
        } finally {
            setIsDeleting(false)
        }
    }

    const handleEdit = (item) => {
        setFormData({
            name: item.name,
            price: item.price,
            description: item.description || '',
            isAvailable: item.isAvailable,
        })
        setImage(null)
        setEditingItemId(item.id)
        setShowEditModal(true)
    }

    const handleAddMenu = () => {
        setFormData({ name: '', price: '', description: '', isAvailable: true })
        setImage(null)
        setEditingItemId(null)
        setShowAddModal(true)
    }

    return (
        <Container maxWidth="lg">
            <Box my={4}>
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    align="center"
                >
                    메뉴 관리
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddMenu}
                    sx={{ mb: 3 }}
                >
                    메뉴 추가
                </Button>

                <MenuList
                    menuItems={menuItems}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isDeleting={isDeleting}
                />

                <MenuAdd
                    showModal={showAddModal}
                    formData={formData}
                    image={image}
                    onSubmit={handleSubmit}
                    onChange={handleInputChange}
                    onImageChange={handleImageChange}
                    onClose={() => setShowAddModal(false)}
                    isSubmitting={isSubmitting}
                />

                <MenuModify
                    showModal={showEditModal}
                    formData={formData}
                    image={image}
                    editImageUrl={
                        editingItemId
                            ? menuItems.find(
                                  (item) => item.id === editingItemId
                              )?.s3MenuUrl
                            : null
                    }
                    onSubmit={handleSubmit}
                    onChange={handleInputChange}
                    onImageChange={handleImageChange}
                    onClose={() => setShowEditModal(false)}
                    onDelete={() => handleDelete(editingItemId)}
                    isSubmitting={isSubmitting}
                    isDeleting={isDeleting}
                />

                {loading && <CircularProgress />}
                <Snackbar
                    open={!!error}
                    autoHideDuration={6000}
                    onClose={() => setError(null)}
                    message={error}
                />
            </Box>
        </Container>
    )
}

export default Menu
