export const getLineItems = (items) => {
  return items.map((item) => {
    return {
      quantity: item.qty,
      price_data: {
        currency: "inr",
        unit_amount: item.finalPrice * 100,
        product_data: {
          name: item.name,
          description: "Action Figure",
          images: [item.img],
        },
      },
    };
  });
};
