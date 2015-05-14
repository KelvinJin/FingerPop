require 'rspec'
require 'require_all'

require_all './Manager'
require_all './Model'
require_all './Extension'

class TokenManagerObserver

  attr_accessor :message, :token

  def initialize observable
    observable.add_observer self
  end

  def update player, token
    @message = "#{ player.name } gets the token -- #{ token }"
    @token = token
  end

end

describe TokenManager, 'When the user Jin requests a token' do

  jin = Player.new '12345', 'Jin'

  herry = Player.new '23456', 'Herry'

  arun = Player.new '34567', 'Arun'

  context 'if there is no token occupied by others and there is no one waiting for the token' do

    token_manager = TokenManager.new
    token_manager_observer = TokenManagerObserver.new token_manager

    it 'should notify the observer that who gets the new token' do
      token_manager.request jin

      expect(token_manager.current_token).not_to eq(nil)

      # Wait for the notification got triggered.
      sleep TOKEN_TIMEOUT

      expect(token_manager_observer.message.include?(jin.name + ' gets the token ')).to eq(true)

      expect(token_manager.verify(token_manager_observer.token)).to eq(false)
    end

  end



  context 'if jin release the token earlier than it expires' do

    token_manager = TokenManager.new
    token_manager_observer = TokenManagerObserver.new token_manager

    it 'should set the current token to nil' do
      token_manager.request jin

      sleep TOKEN_TIMEOUT * 0.1

      expect(token_manager.current_token).not_to eq(nil)
      token_manager.release token_manager_observer.token
      expect(token_manager.current_token).to eq(nil)
    end

  end

  context 'if jin release the token later than it expires' do

    token_manager = TokenManager.new
    token_manager_observer = TokenManagerObserver.new token_manager

    it 'should set the current token to nil already' do
      token_manager.request jin

      sleep TOKEN_TIMEOUT * 1.1

      expect(token_manager.current_token).to eq(nil)
      token_manager.release token_manager_observer.token
      expect(token_manager.current_token).to eq(nil)
    end

  end

  context 'if the token is already occupied by herry and the queue is empty' do

    token_manager = TokenManager.new
    token_manager_observer = TokenManagerObserver.new token_manager

    it 'should put the player in the queue and it should be the first to pop up' do
      token_manager.request herry
      token_manager.request jin

      player = token_manager.token_request_queue.pop

      expect(player).to eq(jin)
    end

    it 'should pop up the user after a time out' do

      sleep TOKEN_TIMEOUT * 0.2
      old_token = token_manager_observer.token

      token_manager.request jin

      sleep TOKEN_TIMEOUT * 1.3

      expect(token_manager.verify(old_token)).to eq(false)

      expect(token_manager.verify(token_manager_observer.token)).to eq(true)

    end
    
  end

  context 'if the token is already occupied by herry and the queue is empty' do

    token_manager = TokenManager.new
    token_manager_observer = TokenManagerObserver.new token_manager

    it 'should put the player in the queue and it should be the first to pop up' do
      token_manager.request herry
      token_manager.request jin

      player = token_manager.token_request_queue.pop

      expect(player).to eq(jin)
    end

    it 'should pop up the user after a time out' do

      sleep TOKEN_TIMEOUT * 0.2
      old_token = token_manager_observer.token

      token_manager.request jin

      sleep TOKEN_TIMEOUT * 1.3

      # this won't effect anything
      token_manager.release(old_token)

      expect(token_manager.verify(old_token)).to eq(false)

      token_manager.release(old_token)

      expect(token_manager.verify(token_manager_observer.token)).to eq(true)

    end

  end

  context 'if the token is already occupied by someone and the queue is not empty' do

    token_manager = TokenManager.new
    token_manager_observer = TokenManagerObserver.new token_manager

    it 'should pop up the user after certain amount of time' do
      token_manager.request herry
      token_manager.request arun
      token_manager.request jin

      sleep TOKEN_TIMEOUT * 1.1

      expect(token_manager_observer.message.include?(arun.name + ' gets the token ')).to eq(true)
      expect(token_manager.verify(token_manager_observer.token)).to eq(true)

      sleep TOKEN_TIMEOUT * 1.1

      expect(token_manager_observer.message.include?(jin.name + ' gets the token ')).to eq(true)
      expect(token_manager.verify(token_manager_observer.token)).to eq(true)

    end

  end

end