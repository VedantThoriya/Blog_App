const formatDate = (isoDate) => {
  return new Date(isoDate).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

module.exports = formatDate;
