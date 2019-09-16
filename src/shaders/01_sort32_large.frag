#ifdef GL_ES
precision mediump float;
precision mediump int;
precision mediump sampler2D;
#endif

uniform sampler2D u_firstBytes;
uniform sampler2D u_secondBytes;
uniform sampler2D u_thirdBytes;
uniform sampler2D u_fourthBytes;
uniform sampler2D u_fifthBytes;
uniform sampler2D u_sixthBytes;
uniform sampler2D u_seventhBytes;
uniform sampler2D u_eighthBytes;
uniform float u_width;
uniform float u_blockSizeX;
uniform float u_blockSizeY;
uniform float u_regionSizeX;
uniform float u_regionSizeY;

float round(float);
float floatEquals(float, float);
float floatNotEquals(float, float);
float floatLessThan(float, float);
float floatGreaterThan(float, float);
float floatLessThanOrEqual(float, float);
float floatGreaterThanOrEqual(float, float);

void main() {
	// calculate starting coordinates for this block
	vec2 blockStartCoord  = vec2(gl_FragCoord.x - floor(mod(floor(gl_FragCoord.x), u_blockSizeX)),
								 gl_FragCoord.y - floor(mod(floor(gl_FragCoord.y), u_blockSizeY)));
	vec2 blockOffset      = vec2(floatEquals(u_blockSizeY, 1.0) * u_blockSizeX, floatGreaterThan(u_blockSizeY, 1.0) * u_blockSizeY);
	vec2 halfBlockOffset  = vec2(floatEquals(blockOffset.y, 0.0) * blockOffset.x / 2.0 +
								 floatEquals(blockOffset.y, 1.0) * floatEquals(blockOffset.x, 0.0) * u_width / 2.0, 
								 floor(blockOffset.y / 2.0));
	vec2 blockMiddleCoord = vec2(blockStartCoord.xy) + halfBlockOffset;

	// calculate starting coordinates for each sorting region
	vec2 ascendingStartCoord  = vec2(gl_FragCoord.x - floor(mod(floor(gl_FragCoord.x), u_regionSizeX)),
									 gl_FragCoord.y - floor(mod(floor(gl_FragCoord.y), u_regionSizeY)));
	vec2 regionOffset         = vec2(floatEquals(u_regionSizeY, 1.0) * u_regionSizeX, floatGreaterThan(u_regionSizeY, 1.0) * u_regionSizeY);
	vec2 halfRegionOffset     = vec2(floatEquals(regionOffset.y, 0.0) * regionOffset.x / 2.0 +
									 floatEquals(regionOffset.y, 1.0) * floatEquals(regionOffset.x, 0.0) * u_width / 2.0, 
									 floor(regionOffset.y / 2.0));
	vec2 descendingStartCoord = vec2(ascendingStartCoord.xy) + halfRegionOffset;

	// get booleans for determining relative position and sorting order
	float ascendingGroupBool = floatLessThan(floor(gl_FragCoord.y), round(descendingStartCoord.y));
	ascendingGroupBool      += floatEquals(floor(gl_FragCoord.y), round(descendingStartCoord.y)) * 
						       floatLessThan(floor(gl_FragCoord.x), round(descendingStartCoord.x));		   
	float firstTexelBool     = floatLessThan(floor(gl_FragCoord.y), round(blockMiddleCoord.y));
	firstTexelBool          += floatEquals(floor(gl_FragCoord.y), round(blockMiddleCoord.y)) * 
					           floatLessThan(floor(gl_FragCoord.x), round(blockMiddleCoord.x));

	// get current data
	vec4 localData = texture2D(u_firstBytes, vec2(gl_FragCoord.xy) / u_width); // replace: u_firstBytes with appropriate uniform

	// get peer data
	vec2 peerFragCoord = floatEquals(firstTexelBool, 1.0) * (gl_FragCoord.xy + halfBlockOffset)
					   + floatEquals(firstTexelBool, 0.0) * (gl_FragCoord.xy - halfBlockOffset);

	// determine which peer texture to pull texture from
	float firstTextureBool   = floatGreaterThan(peerFragCoord.y, 0.0 * u_width) * floatLessThan(peerFragCoord.y, 1.0 * u_width);
	float secondTextureBool  = floatGreaterThan(peerFragCoord.y, 1.0 * u_width) * floatLessThan(peerFragCoord.y, 2.0 * u_width);
	float thirdTextureBool   = floatGreaterThan(peerFragCoord.y, 2.0 * u_width) * floatLessThan(peerFragCoord.y, 3.0 * u_width);
	float fourthTextureBool  = floatGreaterThan(peerFragCoord.y, 3.0 * u_width) * floatLessThan(peerFragCoord.y, 4.0 * u_width);
	float fifthTextureBool   = floatGreaterThan(peerFragCoord.y, 4.0 * u_width) * floatLessThan(peerFragCoord.y, 5.0 * u_width);
	float sixthTextureBool   = floatGreaterThan(peerFragCoord.y, 5.0 * u_width) * floatLessThan(peerFragCoord.y, 6.0 * u_width);
	float seventhTextureBool = floatGreaterThan(peerFragCoord.y, 6.0 * u_width) * floatLessThan(peerFragCoord.y, 7.0 * u_width);
	float eighthTextureBool  = floatGreaterThan(peerFragCoord.y, 7.0 * u_width) * floatLessThan(peerFragCoord.y, 8.0 * u_width);

	// get peer data
	vec4 peerData = texture2D(u_firstBytes,   vec2(peerFragCoord.xy) / u_width) * floatEquals(firstTextureBool, 1.0)
            	  + texture2D(u_secondBytes,  vec2(peerFragCoord.xy) / u_width) * floatEquals(secondTextureBool, 1.0)
            	  + texture2D(u_thirdBytes,   vec2(peerFragCoord.xy) / u_width) * floatEquals(thirdTextureBool, 1.0)
            	  + texture2D(u_fourthBytes,  vec2(peerFragCoord.xy) / u_width) * floatEquals(fourthTextureBool, 1.0)
				  + texture2D(u_fifthBytes,   vec2(peerFragCoord.xy) / u_width) * floatEquals(fifthTextureBool, 1.0)
            	  + texture2D(u_sixthBytes,   vec2(peerFragCoord.xy) / u_width) * floatEquals(sixthTextureBool, 1.0)
            	  + texture2D(u_seventhBytes, vec2(peerFragCoord.xy) / u_width) * floatEquals(seventhTextureBool, 1.0)
            	  + texture2D(u_eighthBytes,  vec2(peerFragCoord.xy) / u_width) * floatEquals(eighthTextureBool, 1.0);

	// create alpha and bravo texels where alpha is expected to be less than bravo
	vec4 alphaData = floatEquals(firstTexelBool, 1.0) * floatEquals(ascendingGroupBool, 1.0) * localData.rgba
				   + floatEquals(firstTexelBool, 1.0) * floatEquals(ascendingGroupBool, 0.0) * peerData.rgba
				   + floatEquals(firstTexelBool, 0.0) * floatEquals(ascendingGroupBool, 1.0) * peerData.rgba
				   + floatEquals(firstTexelBool, 0.0) * floatEquals(ascendingGroupBool, 0.0) * localData.rgba;
	vec4 bravoData = floatEquals(firstTexelBool, 1.0) * floatEquals(ascendingGroupBool, 1.0) * peerData.rgba
				   + floatEquals(firstTexelBool, 1.0) * floatEquals(ascendingGroupBool, 0.0) * localData.rgba
				   + floatEquals(firstTexelBool, 0.0) * floatEquals(ascendingGroupBool, 1.0) * localData.rgba
				   + floatEquals(firstTexelBool, 0.0) * floatEquals(ascendingGroupBool, 0.0) * peerData.rgba;

	// denormalize data
	alphaData *= 255.0;
	bravoData *= 255.0;

	// initializing booleans to false
	float swapBool = 0.0;
	float notSwapBool = 0.0;

	// compare each byte in order to determine if swap is necessary
	swapBool    += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatGreaterThan(round(alphaData.a), round(bravoData.a));
	notSwapBool += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatLessThan(round(alphaData.a), round(bravoData.a));
	swapBool    += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatGreaterThan(round(alphaData.b), round(bravoData.b));
	notSwapBool += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatLessThan(round(alphaData.b), round(bravoData.b));
	swapBool    += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatGreaterThan(round(alphaData.g), round(bravoData.g));
	notSwapBool += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatLessThan(round(alphaData.g), round(bravoData.g));
	swapBool    += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatGreaterThan(round(alphaData.r), round(bravoData.r));
	notSwapBool += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatLessThan(round(alphaData.r), round(bravoData.r));

	// handle edge case where bytes are identical and thus both booleans are false
	notSwapBool += floatEquals(notSwapBool, 0.0) * floatEquals(swapBool, 0.0);

	// use booleans to render the correct texel
	gl_FragColor = floatEquals(notSwapBool, 1.0) * localData.rgba / 255.0
				 + floatEquals(notSwapBool, 0.0) * peerData.rgba / 255.0;
}
