export const getLineItems = (items) => {
  return items.map((item) => {
    return {
      quantity: item.qty,
      price_data: {
        currency: "inr",
        unit_amount: item.finalPrice * 100,
        product_data: {
          name: `${item.name}|${item._id}`,
          description: `Action Figure`,
          images: [item.img],
        },
      },
    };
  });
};

export const getOrderData = (items) => {
  return items.reduce((acc, curr) => {
    return [
      ...acc,
      {
        product: curr.description.split("|")[1],
        quantity: curr.quantity,
      },
    ];
  }, []);
};
