# Import file "search-box-mockup"
sketch = Framer.Importer.load("imported/search-box-mockup@1x")

# Setup the dropdown
sketch.Dropdown.visible = false

# Setup the search field
sketch.Search.visible = false
sketch.Search.opacity = 0
sketch.Search.y       = sketch.Search.y + 300

# Setup the hover state on the toggle button
sketch.BtnHover.visible = false

sketch.Btn.on Events.MouseOver, (evt, layer) ->
	layer.opacity = 0
	layer.visible = false 
	layer.x = layer.x - 300
	
	sketch.BtnHover.visible = true
	sketch.BtnHover.opacity = 1

sketch.BtnHover.on Events.MouseOut, (evt, layer) ->
	sketch.BtnHover.opacity = 0
	sketch.BtnHover.visible = false
	
	if sketch.Search.visible == false
		sketch.Btn.visible = true
		sketch.Btn.opacity = 1
		sketch.Btn.x = sketch.Btn.x + 300

sketch.BtnHover.on Events.Click, (evt, layer) ->
	fadeIn = new Animation sketch.Search,
		opacity: 1
		y: sketch.Search.y - 300
		options:
			curve: Spring(damping: 0.5)
			time: 0.3
	
	fadeIn.on Events.AnimationEnd, () ->
		print(sketch.Search.y)
		
	fadeOut = new Animation layer,
		x: layer.x - 300
		opacity: 0
		options:
			curve: Bezier.ease 
			time: 0.2
	
	fadeOut.on Events.AnimationEnd, () ->
		sketch.Search.visible = true
		fadeIn.start()
		
	fadeOut.start()

sketch.Close.on Events.Click, () ->
	fadeIn = new Animation sketch.Btn,
		x: sketch.Btn.x + 300
		opacity: 1
		options:
			curve: Spring(damping: 0.5)
			time: 0.1
	
	fadeIn.on Events.AnimationEnd, () ->
		sketch.BtnHover.x = sketch.Btn.x
	
	# Animate the input field away
	fadeOut = new Animation sketch.Search,
		y: sketch.Search.y + 300
		opacity: 0
		options:
			curve: Spring(damping: 0.5) 
			time: 0.3
	
	fadeOut.on Events.AnimationEnd, () ->
		sketch.Search.visible = false 
		
		# Prepare the button for being animated back into view
		sketch.Btn.visible = true
		fadeIn.start()
	
	fadeOut.start()


