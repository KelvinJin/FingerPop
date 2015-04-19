require 'rspec'
require './Model/Command/command_factory'
require './Model/Command/session_start_command'
require './Model/Command/session_end_command'
require './Model/Command/player_name_change_command'
require './Model/Command/letter_insert_command'

describe CommandFactory, 'When I send the json as a string to the command factory' do

  command_factory = CommandFactory.new

  context 'If the json string is in the format of start session command' do
    start_session_command_json = {:Type => 0, :Content => {:@ip_addr => '127.0.0.1'}}
    it 'should return a new session start command object' do
      object = command_factory.make_command JSON.generate start_session_command_json
      expect(object).to be_a SessionStartCommand
      expect(object.to_json[:@ip_addr]).to eq(start_session_command_json[:Content][:@ip_addr])
    end
  end

  context 'If the json string is in the format of end session command' do
    end_session_command_json = {:Type => 1,
                               :Content => {:@session_id => '123456abc',
                                            :@player_id => 'dskjfdlksajfl'}}
    it "should return a new session end command object" do
      object = command_factory.make_command JSON.generate end_session_command_json
      expect(object).to be_a SessionEndCommand
      expect(object.to_json).to eq(end_session_command_json[:Content])
    end
  end

  context 'If the json string is in the format of player name change' do
    player_name_change_command_json = {:Type => 2,
                               :Content => {:@session_id => '123456abc',
                                            :@player_id => 'dskjfdlksajfl',
                                            :@old_name => "Jin",
                                            :@new_name => 'Herry'}}
    it "should return a new player name change command object" do
      object = command_factory.make_command JSON.generate player_name_change_command_json
      expect(object).to be_a PlayerNameChangeCommand
      expect(object.to_json).to eq(player_name_change_command_json[:Content])
    end
  end

  context 'If the json string is in the format of player name change' do
    letter_insert_command_json = {:Type => 3,
                                       :Content => {:@session_id => '123456abc',
                                                    :@player_id => 'dskjfdlksajfl',
                                                    :@card_letter => "J",
                                                    :@slot_id => 1}}
    it "should return a new player name change command object" do
      object = command_factory.make_command JSON.generate letter_insert_command_json
      expect(object).to be_a LetterInsertCommand
      expect(object.to_json).to eq(letter_insert_command_json[:Content])
    end
  end
end