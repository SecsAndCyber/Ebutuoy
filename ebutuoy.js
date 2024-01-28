// Copyright (c) 2021 Matthew Molyett. All rights reserved.

/**
 * Implements the EbutuoyObject object that powers the extension.
 *
 * @author matthew@molyett.com (Matthew Molyett)
 */

/**
 * Prevents YouTube rabbit-hole diversions by blocking youtube to youtube navigation
 *
 * @constructor
 */
function EbutuoyObject() {
  // Bind handlers to the 'webRequest' events
  chrome.webRequest.onBeforeSendHeaders.addListener(
      this.onBeforeSendHeaders_.bind(this),
	  {urls: []},
	  ['blocking', 'requestHeaders']);
}

///////////////////////////////////////////////////////////////////////////////

EbutuoyObject.prototype = {
  /**
   * Handler for the 'onBeforeSendHeaders' event. Blocks navigation from youtube to youtube
   *
   * @param {!Object} data The event data generated for this request.
   * @private
   */
  onBeforeSendHeaders_: function(data) {
	  if(! data.url.match(/^.{10,25}youtube/)){ 
		return; 
	  }
	  if(data.initiator && data.initiator.match(/youtube/)) { return {cancel:true}; }
	  return {cancel:true};
  }
};