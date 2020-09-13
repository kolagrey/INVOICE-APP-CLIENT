const getChartData = (data = []) => {
  let result = [];
  for (let i = 0; i <= 24; i++) {
    const current = data.filter(item => parseInt(item.hour, 10) === i);
    const _total = current.length ? current[0].total : 0;
    if (i === 0) {
      result.push({
        name: '12AM',
        hour: i,
        total: _total
      });
    }
    if (i > 0 && i < 12) {
      result.push({
        name: `${i}AM`,
        hour: i,
        total: _total
      });
    }
    if (i > 11 && i < 24) {
      result.push({
        name: `${i - 12 ? i - 12 : '12'}PM`,
        hour: i,
        total: _total
      });
    }
  }

  return result;
};
export {
  getChartData
};