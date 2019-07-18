function cleanArray(arr) {
  arr.filter(function( element ) {
   return (element !== undefined) && (element !== null);
  });

  return arr;
}

export default cleanArray;
