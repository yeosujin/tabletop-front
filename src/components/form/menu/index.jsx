import React from 'react'
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { styled } from '@mui/material/styles'

const Input = styled('input')({
    display: 'none',
})

const ImagePreview = styled('img')({
    maxWidth: '100%',
    maxHeight: '200px',
    objectFit: 'contain',
    marginBottom: '1rem',
})

const RadioInputs = styled('div')({
    position: 'relative',
    display: 'flex',
    flexWrap: 'wrap',
    borderRadius: '0.5rem',
    backgroundColor: '#EEE',
    boxSizing: 'border-box',
    boxShadow: '0 0 0px 1px rgba(0, 0, 0, 0.06)',
    padding: '0.25rem',
    width: '300px',
    fontSize: '14px',
    margin: '1rem 0',
})

const RadioLabel = styled('label')({
    flex: '1 1 auto',
    textAlign: 'center',
    '& input': {
        display: 'none',
    },
    '& .name': {
        display: 'flex',
        cursor: 'pointer',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '0.5rem',
        border: 'none',
        padding: '.5rem 0',
        color: 'rgba(51, 65, 85, 1)',
        transition: 'all .15s ease-in-out',
    },
    '& input:checked + .name': {
        backgroundColor: '#fff',
        fontWeight: 600,
    },
})

const MenuForm = ({
    showModal,
    formData,
    image,
    editImageUrl,
    onSubmit,
    onChange,
    onImageChange,
    onClose,
    onDelete,
    isSubmitting,
    isDeleting,
    isEditMode,
}) => {
    const handleRadioChange = (event) => {
        onChange({
            target: {
                name: 'isAvailable',
                value: event.target.value === 'true',
            },
        })
    }

    return (
        <Dialog open={showModal} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEditMode ? '메뉴 수정' : '메뉴 추가'}</DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    onSubmit={onSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    {/* 이미지 미리보기 */}
                    {(image || editImageUrl) && (
                        <Box
                            sx={{
                                mb: 2,
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <ImagePreview
                                src={
                                    image
                                        ? URL.createObjectURL(image)
                                        : editImageUrl
                                }
                                alt="Preview"
                            />
                        </Box>
                    )}

                    {/* 이미지 업로드 버튼 */}
                    <Box
                        sx={{
                            mb: 3,
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <label htmlFor="contained-button-file">
                            <Input
                                accept="image/*"
                                id="contained-button-file"
                                type="file"
                                onChange={onImageChange}
                            />
                            <Button
                                variant="contained"
                                component="span"
                                startIcon={<CloudUploadIcon />}
                            >
                                이미지{' '}
                                {image || editImageUrl ? '변경' : '업로드'}
                            </Button>
                        </label>
                    </Box>

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="메뉴 이름"
                        name="name"
                        value={formData.name}
                        onChange={onChange}
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="price"
                        label="가격"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={onChange}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="description"
                        label="설명"
                        name="description"
                        multiline
                        rows={4}
                        value={formData.description}
                        onChange={onChange}
                    />
                    <RadioInputs>
                        <RadioLabel>
                            <input
                                type="radio"
                                name="isAvailable"
                                value="true"
                                checked={formData.isAvailable === true}
                                onChange={handleRadioChange}
                            />
                            <span className="name">판매 가능</span>
                        </RadioLabel>
                        <RadioLabel>
                            <input
                                type="radio"
                                name="isAvailable"
                                value="false"
                                checked={formData.isAvailable === false}
                                onChange={handleRadioChange}
                            />
                            <span className="name">판매 중지</span>
                        </RadioLabel>
                    </RadioInputs>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>취소</Button>
                {isEditMode && (
                    <Button
                        onClick={onDelete}
                        color="error"
                        disabled={isDeleting}
                    >
                        {isDeleting ? '삭제 중...' : '삭제'}
                    </Button>
                )}
                <Button
                    onClick={onSubmit}
                    variant="contained"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? '저장 중...' : '저장'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default MenuForm
