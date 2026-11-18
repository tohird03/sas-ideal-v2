/* eslint-disable max-len */
export const getPaginationParams = (total?: number) => total
  ? ({
    total,
    showTotal: (total: number) => (`Jami: ${total} ta`),
  })
  : {};

export const getPromotionPaginationParams = (total?: number, pageSize?: number) => total
  ? ({
    total,
    showTotal: (total: number) => (`Bu sahifadagi ${pageSize} tadan ${total} tasi ushbu aksiyaga hali qo'shilmagan. Qolgan mahsulotlarni keyingi sahifada ko'rishingiz mumkin.`),
  })
  : {};
