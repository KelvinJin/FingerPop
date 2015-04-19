require 'bisect/core_ext'

class Array
  def bindex obj = nil
    if block_given?
      binary_search { |x| yield(x) }
    else
      index = self.bisect_left obj
      self[index] == obj && index != self.length ? index : -1
    end
  end

  def binsert obj
    self.insort_left obj
  end

  # Delete if the obj exist
  def bdelete obj = nil
    if block_given?
      index = binary_search { |x| yield(x) }
      delete_at index if index != -1
    else
      index = bindex(obj)
      delete_at index if index != -1
    end
  end

  # if passing a block:
  #   The block must return positive number when the obj is smaller.
  #   and return negative when the obj is bigger.
  #   and 0 when the obj equals to want you want.
  #
  # For example:
  #   [1, 2, 3, 4].binary_search { |x| 3 - x } // 2
  #   [1, 2, 3, 4].binary_search { |x| 5 - x } // -1
  #   [1, 2, 3, 4].binary_search { |x| x - 3 } // -1
  #
  def binary_search(left = 0, right = nil)
    right = self.size - 1 unless right
    mid = (left + right) / 2

    return -1 if left > right

    if yield(self[mid]) == 0
      mid
    elsif yield(self[mid]) > 0
      binary_search(mid + 1, right) { |x| yield(x) }
    else
      binary_search(left, mid - 1) { |x| yield(x) }
    end
  end
end