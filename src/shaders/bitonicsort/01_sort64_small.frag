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
	// double the blockSize area
	float dblBlockSizeY = u_blockSizeY + u_blockSizeY * floatEquals(u_blockSizeX, u_width);
	float dblBlockSizeX = u_blockSizeX + u_blockSizeX * floatLessThan(u_blockSizeX, u_width);

	// calculate starting coordinates for this block
	vec2 blockStartCoord  = vec2(gl_FragCoord.x - floor(mod(floor(gl_FragCoord.x), dblBlockSizeX)),
								 gl_FragCoord.y - floor(mod(floor(gl_FragCoord.y), dblBlockSizeY)));
	vec2 blockOffset      = vec2(floatEquals(dblBlockSizeY, 1.0) * dblBlockSizeX, floatGreaterThan(dblBlockSizeY, 1.0) * dblBlockSizeY);
	vec2 halfBlockOffset  = vec2(floatEquals(blockOffset.y, 0.0) * blockOffset.x / 2.0 +
								 floatEquals(blockOffset.y, 1.0) * floatEquals(blockOffset.x, 0.0) * u_width / 2.0, 
								 floor(blockOffset.y / 2.0));
	vec2 blockMiddleCoord = vec2(blockStartCoord.xy) + halfBlockOffset;

	// double the regionSize area
	float dblRegionSizeY = u_regionSizeY + u_regionSizeY * floatEquals(u_regionSizeX, u_width);
	float dblRegionSizeX = u_regionSizeX + u_regionSizeX * floatLessThan(u_regionSizeX, u_width);

	// calculate starting coordinates for each sorting region
	vec2 ascendingStartCoord  = vec2(gl_FragCoord.x - floor(mod(floor(gl_FragCoord.x), dblRegionSizeX)),
									 gl_FragCoord.y - floor(mod(floor(gl_FragCoord.y), dblRegionSizeY)));
	vec2 regionOffset         = vec2(floatEquals(dblRegionSizeY, 1.0) * dblRegionSizeX, floatGreaterThan(dblRegionSizeY, 1.0) * dblRegionSizeY);
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
	vec2 localDataCoord = vec2(floor(gl_FragCoord.x) - mod(floor(gl_FragCoord.x), 2.0), gl_FragCoord.y);
	vec4 localDataOne = texture2D(u_bytes, vec2(localDataCoord.xy + vec2(0.5, 0.0)) / u_width);
	vec4 localDataTwo = texture2D(u_bytes, vec2(localDataCoord.xy + vec2(1.5, 0.0)) / u_width);

	// get peer data
	vec2 peerFragCoord = floatEquals(firstTexelBool, 1.0) * (localDataCoord.xy + halfBlockOffset)
					   + floatEquals(firstTexelBool, 0.0) * (localDataCoord.xy - halfBlockOffset);
	vec4 peerDataOne = texture2D(u_bytes, vec2(peerFragCoord.xy + vec2(0.5, 0.0)) / u_width);
	vec4 peerDataTwo = texture2D(u_bytes, vec2(peerFragCoord.xy + vec2(1.5, 0.0)) / u_width);
	
	// create alpha and bravo texels where alpha is expected to be less than bravo
	vec4 alphaDataOne = floatEquals(firstTexelBool, 1.0) * floatEquals(ascendingGroupBool, 1.0) * localDataOne.rgba
				      + floatEquals(firstTexelBool, 1.0) * floatEquals(ascendingGroupBool, 0.0) * peerDataOne.rgba
				      + floatEquals(firstTexelBool, 0.0) * floatEquals(ascendingGroupBool, 1.0) * peerDataOne.rgba
				      + floatEquals(firstTexelBool, 0.0) * floatEquals(ascendingGroupBool, 0.0) * localDataOne.rgba;
	vec4 alphaDataTwo = floatEquals(firstTexelBool, 1.0) * floatEquals(ascendingGroupBool, 1.0) * localDataTwo.rgba
				      + floatEquals(firstTexelBool, 1.0) * floatEquals(ascendingGroupBool, 0.0) * peerDataTwo.rgba
				      + floatEquals(firstTexelBool, 0.0) * floatEquals(ascendingGroupBool, 1.0) * peerDataTwo.rgba
				      + floatEquals(firstTexelBool, 0.0) * floatEquals(ascendingGroupBool, 0.0) * localDataTwo.rgba;
	vec4 bravoDataOne = floatEquals(firstTexelBool, 1.0) * floatEquals(ascendingGroupBool, 1.0) * peerDataOne.rgba
				      + floatEquals(firstTexelBool, 1.0) * floatEquals(ascendingGroupBool, 0.0) * localDataOne.rgba
				      + floatEquals(firstTexelBool, 0.0) * floatEquals(ascendingGroupBool, 1.0) * localDataOne.rgba
				      + floatEquals(firstTexelBool, 0.0) * floatEquals(ascendingGroupBool, 0.0) * peerDataOne.rgba;
	vec4 bravoDataTwo = floatEquals(firstTexelBool, 1.0) * floatEquals(ascendingGroupBool, 1.0) * peerDataTwo.rgba
					  + floatEquals(firstTexelBool, 1.0) * floatEquals(ascendingGroupBool, 0.0) * localDataTwo.rgba
					  + floatEquals(firstTexelBool, 0.0) * floatEquals(ascendingGroupBool, 1.0) * localDataTwo.rgba
					  + floatEquals(firstTexelBool, 0.0) * floatEquals(ascendingGroupBool, 0.0) * peerDataTwo.rgba;

	// denormalize data
	alphaDataOne *= 255.0;
	alphaDataTwo *= 255.0;
	bravoDataOne *= 255.0;
	bravoDataTwo *= 255.0;

	// initializing booleans to false
	float swapBool = 0.0;
	float notSwapBool = 0.0;

	// compare each byte in order to determine if swap is necessary
	swapBool    += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatGreaterThan(round(alphaDataTwo.a), round(bravoDataTwo.a));
	notSwapBool += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatLessThan(round(alphaDataTwo.a), round(bravoDataTwo.a));
	swapBool    += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatGreaterThan(round(alphaDataTwo.b), round(bravoDataTwo.b));
	notSwapBool += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatLessThan(round(alphaDataTwo.b), round(bravoDataTwo.b));
	swapBool    += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatGreaterThan(round(alphaDataTwo.g), round(bravoDataTwo.g));
	notSwapBool += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatLessThan(round(alphaDataTwo.g), round(bravoDataTwo.g));
	swapBool    += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatGreaterThan(round(alphaDataTwo.r), round(bravoDataTwo.r));
	notSwapBool += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatLessThan(round(alphaDataTwo.r), round(bravoDataTwo.r));
	swapBool    += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatGreaterThan(round(alphaDataOne.a), round(bravoDataOne.a));
	notSwapBool += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatLessThan(round(alphaDataOne.a), round(bravoDataOne.a));
	swapBool    += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatGreaterThan(round(alphaDataOne.b), round(bravoDataOne.b));
	notSwapBool += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatLessThan(round(alphaDataOne.b), round(bravoDataOne.b));
	swapBool    += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatGreaterThan(round(alphaDataOne.g), round(bravoDataOne.g));
	notSwapBool += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatLessThan(round(alphaDataOne.g), round(bravoDataOne.g));
	swapBool    += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatGreaterThan(round(alphaDataOne.r), round(bravoDataOne.r));
	notSwapBool += floatEquals(swapBool, 0.0) * floatEquals(notSwapBool, 0.0) * floatLessThan(round(alphaDataOne.r), round(bravoDataOne.r));

	// handle edge case where bytes are identical and thus both booleans are false
	notSwapBool += floatEquals(notSwapBool, 0.0) * floatEquals(swapBool, 0.0);

	// use booleans to render the correct texel
	gl_FragColor = floatEquals(notSwapBool, 1.0) * floatEquals(mod(floor(gl_FragCoord.x), 2.0), 0.0) * localDataOne.rgba / 255.0
				 + floatEquals(notSwapBool, 1.0) * floatEquals(mod(floor(gl_FragCoord.x), 2.0), 1.0) * localDataTwo.rgba / 255.0
				 + floatEquals(notSwapBool, 0.0) * floatEquals(mod(floor(gl_FragCoord.x), 2.0), 0.0) * peerDataOne.rgba / 255.0
				 + floatEquals(notSwapBool, 0.0) * floatEquals(mod(floor(gl_FragCoord.x), 2.0), 1.0) * peerDataTwo.rgba / 255.0;
}
