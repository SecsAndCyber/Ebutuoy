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
	  if(! data.url.match(/^.{10,25}youtube/)){ return; }
	  
	  var skip_types = ['ping','image','script', 'stylesheet', 'other'];
	  var skip_apis_re = /youtube.*(comment_service_ajax|error_204|get_midroll_info|v1\/next|log_event|\/player|notification\/get_unseen_count|api\/stats)/;
	  var allow_requesters_re = /hcpss.instructure.com|molyett.com/;	  
	  if(data.initiator && data.initiator.match(allow_requesters_re)) { return }
	  if (data.url.match(/googlevideo/) && (data.initiator && data.initiator.match(/youtube/))) { return }
	  if(skip_types.indexOf(data.type) >= 0){ return }	  
	  if(data.url.match(skip_apis_re) && data.type.match(/xmlhttprequest/)){ return }
	  	  
	  if(data.url.match(/youtube.*watch/) && data.type.match(/xmlhttprequest/)){ return {cancel:true}; }
	  if(data.url.match(/youtube.*embed/) && data.type.match(/sub_frame/)){ return {cancel:true}; }
	  
	  if(data.type.match(/main_frame/)) {	  
		  if (data.url.match(/youtube/)) {
			return {cancel:true};
		  }
	  }
  }
};