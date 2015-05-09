require 'singleton'

class WordListManager
  include Singleton

  def load_word_list word_list_file, minimum_length=5, maximum_length=13
    @word_list = File.new(word_list_file).readlines.delete_if { |l| l.chomp.length < minimum_length || l.chomp.length > maximum_length }. map { |l| l.chomp }
  end

  def random_words num
    @word_list.sample num
  end

end