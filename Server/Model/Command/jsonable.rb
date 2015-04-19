require 'json'

module JSONable
  def to_json
    hash = {}
    self.instance_variables.each do |var|
      hash[var.to_sym] = self.instance_variable_get var
    end
    hash
  end

  def from_json! hash
    hash.each do |var, val|
      self.instance_variable_set var, val
    end
  end
end