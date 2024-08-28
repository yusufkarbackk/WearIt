import express from 'express';
import { createBaju, deleteBaju, getWearItData, kurangiStok, patchBaju, searchBaju, stokHabis, stokMinim, tambahStok } from '../controllers/productControllers.mjs';
import { checkSchema, query, body } from 'express-validator';
import { createBajuValidationSchema, updateBajuVaidationSchema } from '../utils/vallidationSchema.mjs';
const router = express.Router()

router.get('/WearIt', getWearItData)
router.post('/WearIt', checkSchema(createBajuValidationSchema), createBaju)
router.patch('/WearIt/:id', checkSchema(updateBajuVaidationSchema), patchBaju)
router.delete('/WearIt/:id', deleteBaju)
router.get('/WearIt/search', [
    query('warna').isString().custom(value => isNaN(value)).withMessage('Warna harus bertipe string'),
    query('ukuran').isString().custom(value => isNaN(value)).withMessage('Ukuran harus bertipe string'),
], searchBaju)
router.patch('/WearIt/:id/tambah-stok', [
    body('jumlah').isInt({ min: 1 }).withMessage('jumlah harus bilangan positif')
], tambahStok);
router.patch('/WearIt/:id/kurangi-stok', [
    body('jumlah').isInt({ min: 1 }).withMessage('Jumlah harus berupa angka positif'),
], kurangiStok)

router.get('/WearIt/stok-habis', stokHabis)
router.get('/WearIt/stok-minim', stokMinim)

export default router