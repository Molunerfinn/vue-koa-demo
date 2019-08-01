'use strict';

/**
 pageNumbers takes a integer (as a string), and returns an object containing
 the provided integer, the integer + 1, and the integer -1. This simplistic
 service gives us an object that can be passed to templates in conjunction with
 a paging object to construct "next" / "previous" buttons in the Library.

 @method pageNumbers
 @param current {Integer} The integer representing the current page number
 @return {String} An object with `current`, `prev` and `next` page numbers
 */
class Pagination{
  constructor( {}){
    this.page = 1
    this.pageSize = 25
    this.total = 0
  }
  
}

function getPagination( query ) {
  // Request params come through as strings: convert to integers
  // If "current" is undefined, assume we're on the first page
  let limit = 10
  let offset = 0

  return {
    limit,
    offset
  }
}

module.exports = { getPagination }
