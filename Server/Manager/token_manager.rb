require 'observer'
require 'securerandom'
require 'thread'


TOKEN_TIMEOUT = 0.5


=begin

 General control flow

        nil queue, nil token
                |
       new request return token
                |
    release/verify and nil token
                |
       new request return token
                |
       new request into queue
                |
    release/verify and move to next
                |
             timeout
                |
        nil queue, nil token
=end

class TokenManager

  attr_reader :token_request_queue, :current_token

  include Observable

  def initialize
    @current_token = nil
    @token_request_queue = Queue.new
    @semaphore = Mutex.new
  end

  def request player, signature
    # If there is no token occupied and no player is waiting, return a new token immediately
    # otherwise, put into the queue
    @semaphore.synchronize {
      if @current_token.nil?
        changed(true)
        notify_observers player, signature, next_token
      else
        @token_request_queue << [player, signature]
      end
    }

  end

  def verify token
    # Verify if the token is valid.
    # If it's valid, then return true and move to the next player in the queue
    # otherwise, return false
    @semaphore.synchronize {
      return (!@current_token.nil? and token == @current_token)
    }
  end

  def release token
    @semaphore.synchronize {
      if @current_token == token
        move_to_next
      end
    }
  end

  def reset
    @current_token = nil
    @token_request_queue.clear
  end

  private

  def count_down token
    Thread.new {
      # Time out if the token expires.
      sleep TOKEN_TIMEOUT

      @semaphore.synchronize {
        if @current_token == token
          move_to_next
        end
      }
    }
  end

  def move_to_next

    # If there's still some one waiting, then we pop it up
    if @token_request_queue.length > 0
      player, signature = @token_request_queue.pop

      changed(true)
      notify_observers player, signature, next_token
    else
      # Else we just reset the token
      @current_token = nil
    end
  end

  def next_token
    @current_token = SecureRandom.hex

    count_down @current_token

    @current_token
  end
end