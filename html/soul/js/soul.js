var Soul = {};
Soul.galleryContentHeight = 486;
Soul.backgrounds = new Array('img/backgrounds/background-1.jpg',
                             'img/backgrounds/background-2.jpg',
                             'img/backgrounds/background-3.jpg',
                             'img/backgrounds/background-4.jpg');
////////////////////////////////////////////////////////////////////////////////
Soul.cycleBackground = function()
{
  var nextIndex = 0;

  do
  {
    nextIndex = Math.floor(Math.random() * (Soul.backgrounds.length-1));
  }
  while($('#backgroundImage').css('background-image').indexOf(Soul.backgrounds[nextIndex]) > -1);

  $('#backgroundImage').fadeOut(
    function()
    {
      $('#backgroundImage').css('background-image', 'url(' + Soul.backgrounds[nextIndex] + ')');
      $('#backgroundImage').fadeIn();
      return;
    }
  );
  
  return;
}
////////////////////////////////////////////////////////////////////////////////
Soul.showOver = function()
{
  $(this).data('original-image', this.src);
  this.src = $(this).data('over-image');
  return;
}
////////////////////////////////////////////////////////////////////////////////
Soul.showOriginal = function()
{
  this.src = $(this).data('original-image');
  return;
}
////////////////////////////////////////////////////////////////////////////////
Soul.showiTunes = function()
{
  $('#iTunesPopUp').show();
  return;
}
////////////////////////////////////////////////////////////////////////////////
Soul.facebook = function()
{
  var data = {'u':location.href,
              't':'Check out my page!'};

  var url = 'http://www.facebook.com/sharer.php?' + $.param(data);
  window.open(url, 'facebookWindow');
  return false;
}
////////////////////////////////////////////////////////////////////////////////
Soul.twitter = function()
{
  var data = {'url':location.href,
              'via':'joannaborromeo',
              'text':"Check my page y'alls!",
              'count':'none',
              'conunturl':location.href};

  var url = this.href + '?' + $.param(data);
  window.open(url, 'twitterWindow');
  return false;
}
////////////////////////////////////////////////////////////////////////////////
Soul.hideiTunes = function()
{
  $('#iTunesPopUp').hide();
  return;
}
////////////////////////////////////////////////////////////////////////////////
Soul.moveiTunes = function(eventObject)
{
  var x = eventObject.pageX;
  var y = eventObject.pageY;

  y -= $('#iTunesPopUp').outerHeight() + 5;
  x -= $('#iTunesPopUp').outerWidth()/2;

  $('#iTunesPopUp').css({'top':y, 'left':x});
  return;
}
////////////////////////////////////////////////////////////////////////////////
Soul.loadPanel = function()
{
  var articleName = $(this).data('panel');
  $('section#body article').hide(400);
  setTimeout(function()
             {
               $('#bodyBackground').animate({height:$('section#body article#' + articleName).height()}, 400);
               $('section#body article#' + articleName).show(400);
             }, 415);
  return;
}
////////////////////////////////////////////////////////////////////////////////
Soul.closeGallery = function()
{
  var div = $('#galleryContent');
  $('#openGalleryTab').animate({'top': '-='+$('#openGalleryTab').outerHeight()});
  div.animate({'height':0}, 1200, 'easeOutQuad');
  div.fadeOut();
  $('#galleryShadow').fadeOut();
  return;
}
////////////////////////////////////////////////////////////////////////////////
Soul.openGallery = function()
{
  var div = $('#galleryContent');

  $('#openGalleryTab').animate({'top': '+='+$('#openGalleryTab').outerHeight()});

  div.fadeIn(433);
  $('#galleryShadow').fadeIn();
  div.animate({'height':div.data('original-height')}, 1200, 'easeOutQuad');
  return;
}
////////////////////////////////////////////////////////////////////////////////
Soul.adjustTab = function()
{
  var destHeight = $('#audioTab').outerHeight();
  var offset = $('nav').offset();
  $('#g').css({'height':destHeight-1, 'width':offset.left});
  return;
}
////////////////////////////////////////////////////////////////////////////////
Soul.adjustTabWidth = function()
{
  var offset = $('nav').offset();
  $('#g').css({'width':offset.left});
  return;
}
////////////////////////////////////////////////////////////////////////////////
Soul.start = function()
{
  $('nav li').click(Soul.loadPanel);
  $('span.PanelLink').click(Soul.loadPanel);
  $('nav li').click(Soul.cycleBackground);
  $('#iTunes').hover(Soul.showiTunes, Soul.hideiTunes);
  $('#iTunes').mousemove(Soul.moveiTunes);
  $('#tLink').click(Soul.twitter);
  $('#fLink').click(Soul.facebook);
  $('.HasOver').hover(Soul.showOver, Soul.showOriginal);

  $('#galleryContent').data('original-height', Soul.galleryContentHeight);
  $('#galleryTab span').click(Soul.closeGallery);
  $('#openGalleryTab').click(Soul.openGallery);
  Soul.adjustTab();
  $(window).resize(Soul.adjustTabWidth);
  return;
}
////////////////////////////////////////////////////////////////////////////////
Soul.load = function()
{
  Soul.gallery = new SoulGallery();
  return;
}
////////////////////////////////////////////////////////////////////////////////
function SoulGalleryItem()
{
  this.div =  document.createElement('div');
  $(this.div).append(document.createElement('img'));
  $(this.div).append(document.createElement('p'));
  return;
}
////////////////////////////////////////////////////////////////////////////////
SoulGalleryItem.prototype.setImage = function(imageElement)
{
  var img = $('img', this.div);
  var width = $(imageElement).width();
  var height = $(imageElement).height();
  var aspectRatio = 0;
  img.attr('src', imageElement.src);

  img.data('original-width', width);
  img.data('original-height', height);
  img.css({'display':'block', 'margin':'auto'});

  if(width > height)
  {
    aspectRatio = height/width;
    this.getSmallerDimension = function(width)
    {
      return width*aspectRatio;
    };
  }
  else
  {
    aspectRatio = width/height;
    this.getSmallerDimension = function(height)
    {
      return height*aspectRatio;
    };
  }
  return;
}
////////////////////////////////////////////////////////////////////////////////
SoulGalleryItem.prototype.getImageConstraints = function(constrainingWidth, constrainingHeight)
{
  var newWidth = 0;
  var newHeight = 0;
  var img = $('img', this.div);
  var originalWidth = img.data('original-width');
  var originalHeight = img.data('original-height');

  if(originalWidth > originalHeight)
  {
    newWidth = Math.min(constrainingWidth, originalWidth);
    newHeight = this.getSmallerDimension(newWidth);
  }
  else
  {
    newHeight = Math.min(constrainingHeight, originalHeight);
    newWidth = this.getSmallerDimension(newHeight);
  }
  return {'width':newWidth, 'height':newHeight};
}
////////////////////////////////////////////////////////////////////////////////
SoulGalleryItem.prototype.setText = function(text)
{
  $('p', this.div).text(text);
  return;
}
////////////////////////////////////////////////////////////////////////////////
SoulGalleryItem.prototype.hideText = function(speed)
{
  $('p', this.div).hide(speed);
  return;
}
////////////////////////////////////////////////////////////////////////////////
SoulGalleryItem.prototype.showText = function(speed)
{
  $('p', this.div).show(speed);
  return;
}
////////////////////////////////////////////////////////////////////////////////
function SoulGallery()
{
  this.currentIndex = 0;
  this.items = new Array();
  this.images = null;
  this.currentWidth = 559;
  this.currentHeight = 299;
  this.otherWidth = this.currentWidth * 0.76;
  this.otherHeight = this.currentHeight * 0.76;
  this.topSpacing = 70;


  this.nextPrevOpacity = 0.30;
  this.nextPrevOverOpacity = 0.60;
  this.maxCurrentImageHeight = this.currentHeight;
  this.nextLeft = $('#galleryContent').width() - this.otherWidth + 0.25 * this.otherWidth;

  this.nextPrevHoverFunction = (this.nextPrevHoverGenerator(this.nextPrevOpacity));

  var i=0;
  var images = $('#galleryContent img');
  var item = null;
  
  for(i=0; i<images.length; ++i)
  {
    item = new SoulGalleryItem();
    this.items[this.items.length] = item;
    item.setImage(images[i]);
    item.setText(images.eq(i).data('description'));
    $(images[i]).hide();
    $('#galleryContent').prepend($(item.div));
    $(item.div).hide();
  }

  var currentGallery = this;
  $(window).resize(function(){currentGallery.setPanels();});

  this.setPanels();
  return;
}
////////////////////////////////////////////////////////////////////////////////
SoulGallery.prototype.applyStyle = function(item, styleType)
{
  var div = $(item.div);
  var width = this.otherWidth;
  var height = this.otherHeight;

  div.unbind();
  div.hover(this.nextPrevHoverFunction);
  item.hideText();

  if(styleType == 'next')
  {
    div.css(this.nextStyle());
    div.click(this.next);
  }
  else if(styleType == 'prev')
  {
    div.css(this.prevStyle());
    div.click(this.prev);
  }
  else if(styleType == 'current')
  {
    div.unbind();
    item.showText();
    div.css(this.currentStyle());
    width = this.currentWidth;
    height = this.maxCurrentImageHeight;
  }

  $('img', item.div).css(item.getImageConstraints(width, height));

  div.show();
  return;
}
////////////////////////////////////////////////////////////////////////////////
SoulGallery.prototype.animateApplyStyle = function(item, styleType)
{
  var div = $(item.div);
  var style = null;
  var click = null;

  if(styleType == 'next')
  {
    style = this.nextStyle();
    click = this.next;
  }
  else
  {
    style = this.prevStyle();
    click = this.prev;
  }
  div.unbind();
  div.hover(this.nextPrevHoverFunction);
  div.click(click);

  if(div.css('display') == 'none')
  {
    div.css(style).hide().fadeIn();
    item.hideText();
    $('img', item.div).css(
      item.getImageConstraints(this.otherWidth, this.otherHeight));
  }
  else
  {
    div.css('z-index',0);
    div.animate(style);
    item.hideText('fast');
    $('img', item.div).animate(
      item.getImageConstraints(this.otherWidth,this.otherHeight));
  }
  return;
}
////////////////////////////////////////////////////////////////////////////////
SoulGallery.prototype.prevStyle = function()
{
  var style = {};
  var prevLeft = 0;
  prevLeft = 0 - 0.25 * this.otherWidth;

  style = this.commonNextPrevStyle(style);
  style['left'] = prevLeft;
  return style;
}
////////////////////////////////////////////////////////////////////////////////
SoulGallery.prototype.animateApplyCurrentStyle = function(currentItem)
{
  var img = $('img', currentItem.div);
  var div = $(currentItem.div);
  var style = this.currentStyle();

  div.unbind();
  div.css({'z-index': 1,'opacity':1});
  currentItem.showText('fast');
  div.animate(style, function(){div.css(style);});
  img.animate(currentItem.getImageConstraints(this.currentWidth,
                                              this.maxCurrentImageHeight));
  
  return;
}
////////////////////////////////////////////////////////////////////////////////
SoulGallery.prototype.currentStyle = function()
{
  var style = null;
  var currentLeft = ($('#galleryContent').width() - this.currentWidth)/2;

  style = {'width':this.currentWidth,
           'min-height':this.currentHeight,
           'position':'absolute',
           'top':this.topSpacing,
           'left':currentLeft,
           'cursor':'auto',
           'z-index':1};
  return style;
}
////////////////////////////////////////////////////////////////////////////////
SoulGallery.prototype.nextStyle = function()
{
  var style = {};
  var nextLeft = $('#galleryContent').width() - this.otherWidth + 0.25 *
    this.otherWidth;

  style = this.commonNextPrevStyle(style);
  style['left'] = nextLeft;
  return style;
}
////////////////////////////////////////////////////////////////////////////////
SoulGallery.prototype.commonNextPrevStyle = function(style)
{
  var top = (this.currentHeight - this.otherHeight)/2 + this.topSpacing;

  style['width'] = this.otherWidth;
  style['min-height'] = this.otherHeight;
  style['position'] = 'absolute';
  style['top'] = top;
  style['cursor'] = 'pointer';
  style['opacity'] = this.nextPrevOpacity;
  style['z-index'] = 0;

  return style;
}
////////////////////////////////////////////////////////////////////////////////
SoulGallery.prototype.nextPrevHoverGenerator = function(offOpacity, onOpacity)
{
  return function(eventObject)
  {
    var div = $($(eventObject.target).closest('div'));
    if(div.css('opacity') == offOpacity)
      div.css('opacity', onOpacity);
    else
      div.css('opacity', offOpacity);
    return;
  }
}
////////////////////////////////////////////////////////////////////////////////
SoulGallery.prototype.next = function()
{
  if(Soul.gallery.currentIndex > (Soul.gallery.items.length-2))
    return;

  ++Soul.gallery.currentIndex;

  if(Soul.gallery.currentIndex-1 > 0)
    $(Soul.gallery.items[Soul.gallery.currentIndex-2].div).hide('fast').unbind();

  Soul.gallery.animateSetPanels();
  return;
}
////////////////////////////////////////////////////////////////////////////////
SoulGallery.prototype.prev = function()
{
  if(Soul.gallery.currentIndex < 1)
    return;

  --Soul.gallery.currentIndex;
  if(Soul.gallery.currentIndex+2 < Soul.gallery.items.length)
    $(Soul.gallery.items[Soul.gallery.currentIndex+2].div).hide('fast').unbind();

  Soul.gallery.animateSetPanels();
  return;
}
////////////////////////////////////////////////////////////////////////////////
SoulGallery.prototype.setPanels = function()
{
  if(this.currentIndex > 0)
    this.applyStyle(this.items[this.currentIndex-1], 'prev');

  this.applyStyle(this.items[this.currentIndex], 'current');

  if((this.currentIndex+1) < this.items.length)
    this.applyStyle(this.items[this.currentIndex+1], 'next');
  return;
}
////////////////////////////////////////////////////////////////////////////////
SoulGallery.prototype.animateSetPanels = function()
{
  if(this.currentIndex > 0)
    this.animateApplyStyle(this.items[this.currentIndex-1], 'prev');

  this.animateApplyCurrentStyle(this.items[this.currentIndex]);
  
  if((this.currentIndex+1) < this.items.length)
    this.animateApplyStyle(this.items[this.currentIndex+1], 'next');
  return;
}
////////////////////////////////////////////////////////////////////////////////
$(document).ready(Soul.start);
$(window).load(Soul.load);