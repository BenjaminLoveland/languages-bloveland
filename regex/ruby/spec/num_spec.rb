# regex_spec.rb
RSpec.describe 'Regular Expression for C++ integer literals' do
    let(:nonzero_decimal_digit) { /[1-9]/ }
    let(:decimal_digit) { /[0-9]/ }
    let(:octal_digit) { /[0-7]/ }
    let(:hex_digit) { /[0-9a-fA-F]/ }
    let(:binary_digit) { /[0-1]/ }
    
    let(:decimal) { /-?(#{nonzero_decimal_digit}('?#{decimal_digit})*)/ }
    let(:octal) { /-?0('?#{octal_digit})+/ }
    let(:hexadecimal) { /-?0[xX]#{hex_digit}('?#{hex_digit})*/ }
    let(:binary) { /-?0[bB]#{binary_digit}('?#{binary_digit})*/ }
    
    let(:integer_literal) { /#{decimal}|#{octal}|#{hexadecimal}|#{binary}/ }
    let(:size) { /[uU]?[lL]{0,2}/ }
    
    let(:pattern) { /^#{integer_literal}#{size}$/ }
  
    let(:should_pass) { 
      [
        "1", "-33'000", "4525235", "10'080", "123'456'789", "1ul", "1u", "1ll", 
        "0123", "0x1A3F", "0XDEAD'BEEF", "0b1101'0011", "0b1u", "0x1ll", "-0xFF", "0b1010LL"
      ] 
    }
    
    let(:should_fail) { 
      [
        "'1'", "1'''3", "afed", "+33", "0", "ul", "lll", "3lll", "3uuull", 
        "0x", "0b", "0x1G", "-0x", "0b1102", "-0b12", "0u", "1lU"
      ] 
    }
  
    describe 'should pass' do
      it 'matches all expected strings' do
        should_pass.each do |str|
          expect(str).to match(pattern)
        end
      end
    end
  
    describe 'should fail' do
      it 'does not match any of the strings' do
        should_fail.each do |str|
          expect(str).not_to match(pattern)
        end
      end
    end
  end
  