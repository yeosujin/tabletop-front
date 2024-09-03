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


    /**
     * 메뉴 항목을 비동기적으로 가져오고 상태를 업데이트하는 함수입니다.
     *
     * 이 함수는 메뉴 항목을 페이지네이션 방식으로 가져옵니다. 현재 로딩 중이거나 더 이상 가져올 항목이 없거나 매장 ID가 없는 경우에는 동작하지 않습니다.
     * 메뉴 항목을 성공적으로 가져오면 상태를 업데이트하고, 실패하면 에러 상태를 설정합니다.
     *
     * @async
     * @function
     * @returns {Promise<void>} - 함수는 값을 반환하지 않으며, 비동기 작업이 완료될 때까지 대기합니다.
     *
     * @description
     * - `loading`, `hasMore`, `storeId`와 같은 상태값을 기반으로 데이터를 가져옵니다.
     * - `getMenus` 함수를 호출하여 메뉴 항목을 가져옵니다.
     * - 메뉴 항목이 성공적으로 로드되면, 이전 메뉴 항목과 새로운 메뉴 항목을 결합하여 상태를 업데이트합니다.
     * - `lastMenuId`를 최신 메뉴 항목의 ID로 업데이트하여 다음 호출 시 페이지네이션을 지원합니다.
     * - 메뉴 항목이 20개가 아닌 경우 `hasMore` 상태를 `false`로 설정하여 더 이상 로드할 항목이 없음을 표시합니다.
     * - 에러가 발생하면 사용자에게 에러 메시지를 표시합니다.
     */
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
            if (!editingItemId && !image) {
                alert('이미지를 등록하세요');
                return;
            }

            let response;
            if (editingItemId) {
                response = await updateMenu(
                    storeId,
                    editingItemId,
                    formDataToSend
                );
                setMenuItems((prev) =>
                    prev.map((item) =>
                        item.id === editingItemId ? response : item
                    )
                );
                setShowEditModal(false);
            } else {
                response = await createMenu(storeId, formDataToSend);
                setMenuItems((prev) => [response, ...prev]);
                setShowAddModal(false);
            }

            setFormData({
                name: '',
                price: '',
                description: '',
                isAvailable: true,
            });
            setImage(null);
        } catch (error) {
            setError(
                '메뉴 저장에 실패했습니다: ' +
                (error.response?.data?.message || error.message)
            );
        } finally {
            setIsSubmitting(false);
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
