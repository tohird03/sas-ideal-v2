export const getPaginationParams = (total?: number) => total
  ? ({
    total,
    showTotal: (total: number) => (`Jami: ${total} ta`),
  })
  : {};
