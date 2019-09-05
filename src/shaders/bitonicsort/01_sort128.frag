#ifdef GL_ES
precision mediump float;
precision mediump int;
precision mediump sampler2D;
#endif

uniform sampler2D u_bytes;
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
	// quadruple the blockSize area
	float dblBlockSizeY = u_blockSizeY + u_blockSizeY * floatEquals(u_blockSizeX, u_width);
	float dblBlockSizeX = u_blockSizeX + u_blockSizeX * floatLessThan(u_blockSizeX, u_width);
	float quadBlockSizeY = dblBlockSizeY + dblBlockSizeY * floatEquals(dblBlockSizeX, u_width);
	float quadBlockSizeX = dblBlockSizeX + dblBlockSizeX * floatLessThan(dblBlockSizeX, u_width);

	// calculate starting coordinates for this block
	vec2 blockStartCoord  = vec2(gl_FragCoord.x - floor(mod(floor(gl_FragCoord.x), quadBlockSizeX)),
								 gl_FragCoord.y - floor(mod(floor(gl_FragCoord.y), quadBlockSizeY)));
	vec2 blockOffset      = vec2(floatEquals(quadBlockSizeY, 1.0) * quadBlockSizeX, floatGreaterThan(quadBlockSizeY, 1.0) * quadBlockSizeY);
	vec2 halfBlockOffset  = vec2(floatEquals(blockOffset.y, 0.0) * blockOffset.x / 2.0 +
								 floatEquals(blockOffset.y, 1.0) * floatEquals(blockOffset.x, 0.0) * u_width / 2.0, 
								 floor(blockOffset.y / 2.0));
	vec2 blockMiddleCoord = vec2(blockStartCoord.xy) + halfBlockOffset;

	// double the regionSize area
	float quadRegionSizeY = u_regionSizeY + u_regionSizeY * floatEquals(u_regionSizeX, u_width);
	float quadRegionSizeX = u_regionSizeX + u_regionSizeX * floatLessThan(u_regionSizeX, u_width);

	// calculate starting coordinates for each sorting region
	vec2 ascendingStartCoord  = vec2(gl_FragCoord.x - floor(mod(floor(gl_FragCoord.x), quadRegionSizeX)),
									 gl_FragCoord.y - floor(mod(floor(gl_FragCoord.y), quadRegionSizeY)));
	vec2 regionOffset         = vec2(floatEquals(quadRegionSizeY, 1.0) * quadRegionSizeX, floatGreaterThan(quadRegionSizeY, 1.0) * quadRegionSizeY);
	vec2 halfRegionOffset     = vec2(floatEquals(regionOffset.y, 0.0) * regionOffset.x / 2.0 +
									 floatEquals(regionOffset.y, 1.0) * floatEquals(regionOffset.x, 0.0) * u_width / 2.0, 
									 floor(regionOffset.y / 2.0));
	vec2 descendingStartCoord = vec2(ascendingStartCoord.xy) + halfRegionOffset;

	// get booleans for determining relative position and sorting order
	float ascendingGroupBool = floatLessThan(floor(gl_FragCoord.y), floor(descendingStartCoord.y));
	ascendingGroupBool      += floatEquals(floor(gl_FragCoord.y), floor(descendingStartCoord.y)) * 
						       floatLessThan(floor(gl_FragCoord.x), floor(descendingStartCoord.x));		   
	float firstTexelBool     = floatLessThan(floor(gl_FragCoord.y), floor(blockMiddleCoord.y));
	firstTexelBool          += floatEquals(floor(gl_FragCoord.y), floor(blockMiddleCoord.y)) * 
					           floatLessThan(floor(gl_FragCoord.x), floor(blockMiddleCoord.x));

	// get current data
	vec2 localDataCoord = vec2(floor(gl_FragCoord.x) - mod(floor(gl_FragCoord.x), 4.0), gl_FragCoord.y);
	vec4 localDataOne   = texture2D(u_bytes, vec2(localDataCoord.xy + vec2(0.5, 0.0)) / u_width);
	vec4 localDataTwo   = texture2D(u_bytes, vec2(localDataCoord.xy + vec2(1.5, 0.0)) / u_width);
	vec4 localDataThree = texture2D(u_bytes, vec2(localDataCoord.xy + vec2(2.5, 0.0)) / u_width);
	vec4 localDataFour  = texture2D(u_bytes, vec2(localDataCoord.xy + vec2(3.5, 0.0)) / u_width);

	// get peer data
	vec2 peerFragCoord = floatEquals(firstTexelBool, 1.0) * (localDataCoord.xy + halfBlockOffset)
					   + floatEquals(firstTexelBool, 0.0) * (localDataCoord.xy - halfBlockOffset);
	vec4 peerDataOne   = texture2D(u_bytes, vec2(peerFragCoord.xy + vec2(0.5, 0.0)) / u_width);
	vec4 peerDataTwo   = texture2D(u_bytes, vec2(peerFragCoord.xy + vec2(1.5, 0.0)) / u_width);
	vec4 peerDataThree = texture2D(u_bytes, vec2(peerFragCoord.xy + vec2(2.5, 0.0)) / u_width);
	vec4 peerDataFour  = texture2D(u_bytes, vec2(peerFragCoord.xy + vec2(3.5, 0.0)) / u_width);
	
	// create alpha and bravo texels where alpha is expected to be less than bravo
	vec4 alphaDataOne   = floatEquals(firstTexelBool, 1.0) * floatEquals(ascendingGroupBool, 1.0) * localDataOne.rgba
				        + floatEquals(firstTexelBool, 1.0) * floatEquals(ascendingGroupBool, 0.0) * peerDataOne.rgba
				        + floatEquals(firstTexelBool, 0.0) * floatEquals(ascendingGroupBool, 1.0) * peerDataOne.rgba
				        + floatEquals(firstTexelBool, 0.0) * floatEquals(ascendingGroupBool, 0.0) * localDataOne.rgba;
	vec4 alphaDataTwo   = floatEquals(firstTexelBool, 1.0) * floatEquals(ascendingGroupBool, 1.0) * localDataTwo.rgba
				        + floatEquals(firstTexelBool, 1.0) * floatEquals(ascendingGroupBool, 0.0) * peerDataTwo.rgba
				        + floatEquals(firstTexelBool, 0.0) * floatEquals(ascendingGroupBool, 1.0) * peerDataTwo.rgba
				        + floatEquals(firstTexelBool, 0.0) * floatEquals(ascendingGroupBool, 0.0) * localDataTwo.rgba;
	vec4 alphaDataThree = floatEquals(firstTexelBool, 1.0) * floatEquals(ascendingGroupBool, 1.0) * localDataThree.rgba
				        + floatEquals(firstTexelBool, 1.0) * floatEquals(ascendingGroupBool, 0.0) * peerDataThree.rgba
				        + floatEquals(firstTexelBool, 0.0) * floatEquals(ascendingGroupBool, 1.0) * peerDataThree.rgba
				        + floatEquals(firstTexelBool, 0.0) * floatEquals(ascendingGroupBool, 0.0) * localDataThree.rgba;
	vec4 alphaDataFour  = floatEquals(firstTexelBool, 1.0) * floatEquals(ascendingGroupBool, 1.0) * localDataFour.rgba
				        + floatEquals(firstTexelBool, 1.0) * floatEquals(ascendingGroupBool, 0.0) * peerDataFour.rgba
				        + floatEquals(firstTexelBool, 0.0) * floatEquals(ascendingGroupBool, 1.0) * peerDataFour.rgba
				        + floatEquals(firstTexelBool, 0.0) * floatEquals(ascendingGroupBool, 0.0) * localDataFour.rgba;
	vec4 bravoDataOne   = floatEquals(firstTexelBool, 1.0) * floatEquals(ascendingGroupBool, 1.0) * peerDataOne.rgba
				        + floatEquals(firstTexelBool, 1.0) * floatEquals(ascendingGroupBool, 0.0) * localDataOne.rgba
				        + floatEquals(firstTexelBool, 0.0) * floatEquals(ascendingGroupBool, 1.0) * localDataOne.rgba
				        + floatEquals(firstTexelBool, 0.0) * floatEquals(ascendingGroupBool, 0.0) * peerDataOne.rgba;
	vec4 bravoDataTwo   = floatEquals(firstTexelBool, 1.0) * floatEquals(ascendingGroupBool, 1.0) * peerDataTwo.rgba
					    + floatEquals(firstTexelBool, 1.0) * floatEquals(ascendingGroupBool, 0.0) * localDataTwo.rgba
					    + floatEquals(firstTexelBool, 0.0) * floatEquals(ascendingGroupBool, 1.0) * localDataTwo.rgba
					    + floatEquals(firstTexelBool, 0.0) * floatEquals(ascendingGroupBool, 0.0) * peerDataTwo.rgba;
	vec4 bravoDataThree = floatEquals(firstTexelBool, 1.0) * floatEquals(ascendingGroupBool, 1.0) * peerDataThree.rgba
				        + floatEquals(firstTexelBool, 1.0) * floatEquals(ascendingGroupBool, 0.0) * localDataThree.rgba
				        + floatEquals(firstTexelBool, 0.0) * floatEquals(ascendingGroupBool, 1.0) * localDataThree.rgba
				        + floatEquals(firstTexelBool, 0.0) * floatEquals(ascendingGroupBool, 0.0) * peerDataThree.rgba;
	vec4 bravoDataFour  = floatEquals(firstTexelBool, 1.0) * floatEquals(ascendingGroupBool, 1.0) * peerDataFour.rgba
					    + floatEquals(firstTexelBool, 1.0) * floatEquals(ascendingGroupBool, 0.0) * localDataFour.rgba
					    + floatEquals(firstTexelBool, 0.0) * floatEquals(ascendingGroupBool, 1.0) * localDataFour.rgba
					    + floatEquals(firstTexelBool, 0.0) * floatEquals(ascendingGroupBool, 0.0) * peerDataFour.rgba;

	// initializing booleans to false
	float swapBool = 0.0;
	float notSwapBool = 0.0;

	// compare each byte in order to determine if swap is necessary
	swapBool    += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatGreaterThan(alphaDataFour.a, bravoDataFour.a);
	notSwapBool += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatLessThan(alphaDataFour.a, bravoDataFour.a);
	swapBool    += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatGreaterThan(alphaDataFour.b, bravoDataFour.b);
	notSwapBool += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatLessThan(alphaDataFour.b, bravoDataFour.b);
	swapBool    += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatGreaterThan(alphaDataFour.g, bravoDataFour.g);
	notSwapBool += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatLessThan(alphaDataFour.g, bravoDataFour.g);
	swapBool    += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatGreaterThan(alphaDataFour.r, bravoDataFour.r);
	notSwapBool += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatLessThan(alphaDataFour.r, bravoDataFour.r);
	swapBool    += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatGreaterThan(alphaDataThree.a, bravoDataThree.a);
	notSwapBool += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatLessThan(alphaDataThree.a, bravoDataThree.a);
	swapBool    += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatGreaterThan(alphaDataThree.b, bravoDataThree.b);
	notSwapBool += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatLessThan(alphaDataThree.b, bravoDataThree.b);
	swapBool    += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatGreaterThan(alphaDataThree.g, bravoDataThree.g);
	notSwapBool += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatLessThan(alphaDataThree.g, bravoDataThree.g);
	swapBool    += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatGreaterThan(alphaDataThree.r, bravoDataThree.r);
	notSwapBool += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatLessThan(alphaDataThree.r, bravoDataThree.r);
	swapBool    += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatGreaterThan(alphaDataTwo.a, bravoDataTwo.a);
	notSwapBool += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatLessThan(alphaDataTwo.a, bravoDataTwo.a);
	swapBool    += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatGreaterThan(alphaDataTwo.b, bravoDataTwo.b);
	notSwapBool += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatLessThan(alphaDataTwo.b, bravoDataTwo.b);
	swapBool    += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatGreaterThan(alphaDataTwo.g, bravoDataTwo.g);
	notSwapBool += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatLessThan(alphaDataTwo.g, bravoDataTwo.g);
	swapBool    += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatGreaterThan(alphaDataTwo.r, bravoDataTwo.r);
	notSwapBool += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatLessThan(alphaDataTwo.r, bravoDataTwo.r);
	swapBool    += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatGreaterThan(alphaDataOne.a, bravoDataOne.a);
	notSwapBool += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatLessThan(alphaDataOne.a, bravoDataOne.a);
	swapBool    += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatGreaterThan(alphaDataOne.b, bravoDataOne.b);
	notSwapBool += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatLessThan(alphaDataOne.b, bravoDataOne.b);
	swapBool    += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatGreaterThan(alphaDataOne.g, bravoDataOne.g);
	notSwapBool += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatLessThan(alphaDataOne.g, bravoDataOne.g);
	swapBool    += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatGreaterThan(alphaDataOne.r, bravoDataOne.r);
	notSwapBool += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatLessThan(alphaDataOne.r, bravoDataOne.r);

	// handle edge case where bytes are identical and thus both booleans are false
	notSwapBool += floatEquals(notSwapBool, 0.0) * floatEquals(swapBool, 0.0);

	// use booleans to render the correct texel
	gl_FragColor = floatEquals(notSwapBool, 1.0) * floatEquals(mod(floor(gl_FragCoord.x), 4.0), 0.0) * localDataOne.rgba
				 + floatEquals(notSwapBool, 1.0) * floatEquals(mod(floor(gl_FragCoord.x), 4.0), 1.0) * localDataTwo.rgba
				 + floatEquals(notSwapBool, 1.0) * floatEquals(mod(floor(gl_FragCoord.x), 4.0), 2.0) * localDataThree.rgba
				 + floatEquals(notSwapBool, 1.0) * floatEquals(mod(floor(gl_FragCoord.x), 4.0), 3.0) * localDataFour.rgba
				 + floatEquals(notSwapBool, 0.0) * floatEquals(mod(floor(gl_FragCoord.x), 4.0), 0.0) * peerDataOne.rgba
				 + floatEquals(notSwapBool, 0.0) * floatEquals(mod(floor(gl_FragCoord.x), 4.0), 1.0) * peerDataTwo.rgba
				 + floatEquals(notSwapBool, 0.0) * floatEquals(mod(floor(gl_FragCoord.x), 4.0), 2.0) * peerDataThree.rgba
				 + floatEquals(notSwapBool, 0.0) * floatEquals(mod(floor(gl_FragCoord.x), 4.0), 3.0) * peerDataFour.rgba;
}
