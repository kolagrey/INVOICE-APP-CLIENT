export const getTotal = ({ target, data }) => {
    const _data = data;
    const result = _data.filter(item => item.resource === target);
    return result.length ? result[0].total : 0;
};

export const k_formatter = (num) => {
    if (num > 999999999) { return (num / 1000000000).toFixed(1) + 'B' }
    if (num > 999999) { return (num / 1000000).toFixed(1) + 'M' }
    if (num > 999) { return (num / 1000).toFixed(1) + 'K' }
    if (num < 999) { return num }
};

export const formatFullName = (firstName, lastName,) => `${firstName} ${lastName}`;