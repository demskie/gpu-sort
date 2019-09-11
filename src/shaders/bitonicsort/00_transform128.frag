#ifdef GL_ES
precision mediump float;
precision mediump int;
precision mediump sampler2D;
#endif

uniform sampler2D u_bytes;
uniform float u_width;
uniform float u_mode;
uniform float u_endianness;

const float PASSTHROUGH = 0.0;
const float INTEGER = 1.0;
const float FLOAT = 2.0;

const float LITTLE_ENDIAN = 0.0;
const float BIG_ENDIAN = 1.0;

float round(float);
float floatEquals(float, float);
float floatLessThan(float, float);
float floatGreaterThan(float, float);
float floatLessThanOrEqual(float, float);
float floatGreaterThanOrEqual(float, float);

void main() {
	// get current texel
	vec2 baseFragCoord = vec2(floor(gl_FragCoord.x) - mod(floor(gl_FragCoord.x), 4.0), floor(gl_FragCoord.y)); 
	vec4 texelOne   = texture2D(u_bytes, vec2(baseFragCoord.xy + vec2(0.5, 0.5)) / u_width);
	vec4 texelTwo   = texture2D(u_bytes, vec2(baseFragCoord.xy + vec2(1.5, 0.5)) / u_width);
	vec4 texelThree = texture2D(u_bytes, vec2(baseFragCoord.xy + vec2(2.5, 0.5)) / u_width);
	vec4 texelFour  = texture2D(u_bytes, vec2(baseFragCoord.xy + vec2(3.5, 0.5)) / u_width);

	// reorder if endianness if not little endian
	vec4 reorderedOne   = floatEquals(u_endianness, LITTLE_ENDIAN) * texelOne.rgba;
	vec4 reorderedTwo   = floatEquals(u_endianness, LITTLE_ENDIAN) * texelTwo.rgba;
	vec4 reorderedThree = floatEquals(u_endianness, LITTLE_ENDIAN) * texelThree.rgba;
	vec4 reorderedFour  = floatEquals(u_endianness, LITTLE_ENDIAN) * texelFour.rgba;
	reorderedOne.r   += floatEquals(u_endianness, BIG_ENDIAN) * texelFour.a;
	reorderedOne.g   += floatEquals(u_endianness, BIG_ENDIAN) * texelFour.b;
	reorderedOne.b   += floatEquals(u_endianness, BIG_ENDIAN) * texelFour.g;
	reorderedOne.a   += floatEquals(u_endianness, BIG_ENDIAN) * texelFour.r;
	reorderedTwo.r   += floatEquals(u_endianness, BIG_ENDIAN) * texelThree.a;
	reorderedTwo.g   += floatEquals(u_endianness, BIG_ENDIAN) * texelThree.b;
	reorderedTwo.b   += floatEquals(u_endianness, BIG_ENDIAN) * texelThree.g;
	reorderedTwo.a   += floatEquals(u_endianness, BIG_ENDIAN) * texelThree.r;
	reorderedThree.r += floatEquals(u_endianness, BIG_ENDIAN) * texelTwo.a;
	reorderedThree.g += floatEquals(u_endianness, BIG_ENDIAN) * texelTwo.b;
	reorderedThree.b += floatEquals(u_endianness, BIG_ENDIAN) * texelTwo.g;
	reorderedThree.a += floatEquals(u_endianness, BIG_ENDIAN) * texelTwo.r;
	reorderedFour.r  += floatEquals(u_endianness, BIG_ENDIAN) * texelOne.a;
	reorderedFour.g  += floatEquals(u_endianness, BIG_ENDIAN) * texelOne.b;
	reorderedFour.b  += floatEquals(u_endianness, BIG_ENDIAN) * texelOne.g;
	reorderedFour.a  += floatEquals(u_endianness, BIG_ENDIAN) * texelOne.r;

	// denormalize texel data
	texelOne   = 255.0 * reorderedOne;
	texelTwo   = 255.0 * reorderedTwo;
	texelThree = 255.0 * reorderedThree;
	texelFour  = 255.0 * reorderedFour;

	// initialize flipped texel
	vec4 flippedOne   = floatEquals(u_mode, PASSTHROUGH) * texelOne.rgba;
	vec4 flippedTwo   = floatEquals(u_mode, PASSTHROUGH) * texelTwo.rgba;
	vec4 flippedThree = floatEquals(u_mode, PASSTHROUGH) * texelThree.rgba;
	vec4 flippedFour  = floatEquals(u_mode, PASSTHROUGH) * texelFour.rgba;

	// determine if we should flip the bits or not
	float signBitIsSet = floatGreaterThanOrEqual(round(texelFour.a), 128.0);

	// for integers just flip the sign bit
	flippedOne.r   += floatEquals(u_mode, INTEGER) * texelOne.r;
	flippedOne.g   += floatEquals(u_mode, INTEGER) * texelOne.g;
	flippedOne.b   += floatEquals(u_mode, INTEGER) * texelOne.b;
	flippedOne.a   += floatEquals(u_mode, INTEGER) * texelOne.a;
	flippedTwo.r   += floatEquals(u_mode, INTEGER) * texelTwo.r;
	flippedTwo.g   += floatEquals(u_mode, INTEGER) * texelTwo.g;
	flippedTwo.b   += floatEquals(u_mode, INTEGER) * texelTwo.b;
	flippedTwo.a   += floatEquals(u_mode, INTEGER) * texelTwo.a;
	flippedThree.r += floatEquals(u_mode, INTEGER) * texelThree.r;
	flippedThree.g += floatEquals(u_mode, INTEGER) * texelThree.g;
	flippedThree.b += floatEquals(u_mode, INTEGER) * texelThree.b;
	flippedThree.a += floatEquals(u_mode, INTEGER) * texelThree.a;
	flippedFour.r  += floatEquals(u_mode, INTEGER) * texelFour.r;
	flippedFour.g  += floatEquals(u_mode, INTEGER) * texelFour.g;
	flippedFour.b  += floatEquals(u_mode, INTEGER) * texelFour.b;
	flippedFour.a  += floatEquals(u_mode, INTEGER) * floatEquals(signBitIsSet, 0.0) * (texelFour.a + 128.0)
				    + floatEquals(u_mode, INTEGER) * floatEquals(signBitIsSet, 1.0) * (texelFour.a - 128.0);

	// for floats flip only sign bit if the sign bit WAS NOT not already set - otherwise flip all of the bits
	flippedOne.r   += floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 0.0) * texelOne.r
				    + floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 1.0) * (255.0 - texelOne.r);
	flippedOne.g   += floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 0.0) * texelOne.g
			        + floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 1.0) * (255.0 - texelOne.g);
	flippedOne.b   += floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 0.0) * texelOne.b
			        + floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 1.0) * (255.0 - texelOne.b);
	flippedOne.a   += floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 0.0) * texelOne.b
			        + floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 1.0) * (255.0 - texelOne.b);
	flippedTwo.r   += floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 0.0) * texelTwo.r
				    + floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 1.0) * (255.0 - texelTwo.r);
	flippedTwo.g   += floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 0.0) * texelTwo.g
			        + floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 1.0) * (255.0 - texelTwo.g);
	flippedTwo.b   += floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 0.0) * texelTwo.b
			        + floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 1.0) * (255.0 - texelTwo.b);
	flippedTwo.a   += floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 0.0) * texelTwo.b
			        + floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 1.0) * (255.0 - texelTwo.b);
	flippedThree.r += floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 0.0) * texelThree.r
				    + floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 1.0) * (255.0 - texelThree.r);
	flippedThree.g += floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 0.0) * texelThree.g
			        + floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 1.0) * (255.0 - texelThree.g);
	flippedThree.b += floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 0.0) * texelThree.b
			        + floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 1.0) * (255.0 - texelThree.b);
	flippedThree.a += floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 0.0) * texelThree.b
			        + floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 1.0) * (255.0 - texelThree.b);
	flippedFour.r  += floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 0.0) * texelFour.r
				    + floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 1.0) * (255.0 - texelFour.r);
	flippedFour.g  += floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 0.0) * texelFour.g
			        + floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 1.0) * (255.0 - texelFour.g);
	flippedFour.b  += floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 0.0) * texelFour.b
			        + floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 1.0) * (255.0 - texelFour.b);
	flippedFour.a  += floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 0.0) * (texelFour.a + 128.0)
			        + floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 1.0) * (255.0 - texelFour.a);

	// output denormalized bytes
	gl_FragColor = floatEquals(mod(floor(gl_FragCoord.x), 4.0), 0.0) * (flippedOne.rgba / 255.0)
				 + floatEquals(mod(floor(gl_FragCoord.x), 4.0), 1.0) * (flippedTwo.rgba / 255.0)
				 + floatEquals(mod(floor(gl_FragCoord.x), 4.0), 2.0) * (flippedThree.rgba / 255.0)
				 + floatEquals(mod(floor(gl_FragCoord.x), 4.0), 3.0) * (flippedFour.rgba / 255.0);
}