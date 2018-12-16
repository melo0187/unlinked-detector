describe('Scanner', function() {
  var Scanner = require('../lib/Scanner')

  beforeEach(function() {
    scanner = new Scanner()
  })

  describe('#setupHandlersWithWsAndStart', function () {
    it('should throw an exception if ws is undefined', function () {
      expect(function() {
        scanner.setupHandlersWithWsAndStart(undefined, 'https://google.com')
      }).toThrowError('Parameter ws it no allowed to be undefined')
    })
  })
})