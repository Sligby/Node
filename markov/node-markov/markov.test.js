describe('MarkovMachine', () => {

    let text;

    beforeEach(function(){
        text = 'the cat in the hat';
    })
    test('constructor initializes words array', () => {
      const markovMachine = new MarkovMachine(text);
      expect(markovMachine.words).toEqual(['the', 'cat', 'in', 'the', 'hat']);
    });
  
    test('makeChains creates correct chains', () => {
      const markovMachine = new MarkovMachine(text);
      expect(markovMachine.chains.get('the')).toEqual(['cat', 'hat']);
      expect(markovMachine.chains.get('cat')).toEqual(['in']);
      expect(markovMachine.chains.get('in')).toEqual(['the']);
      expect(markovMachine.chains.get('hat')).toEqual([null]);
    });
  
    test('makeText generates random text', () => {
      const markovMachine = new MarkovMachine(text);
      const generatedText = markovMachine.makeText(3); // Generate 3 words
      const words = generatedText.split(' ');
      expect(words).toHaveLength(3);
    });
  
    
  });