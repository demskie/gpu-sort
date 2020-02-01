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
	vec2 baseFragCoord = vec2(floor(gl_FragCoord.x) - mod(floor(gl_FragCoord.x), 2.0), floor(gl_FragCoord.y)); 
	vec4 texelOne = texture2D(u_bytes, vec2(baseFragCoord.xy + vec2(0.5, 0.5)) / u_width);
	vec4 texelTwo = texture2D(u_bytes, vec2(baseFragCoord.xy + vec2(1.5, 0.5)) / u_width);

	// reorder if endianness if not little endian
	vec4 reorderedOne = floatEquals(u_endianness, LITTLE_ENDIAN) * texelOne.rgba
                      + floatEquals(u_endianness, BIG_ENDIAN) * texelTwo.abgr;
	vec4 reorderedTwo = floatEquals(u_endianness, LITTLE_ENDIAN) * texelTwo.rgba
                      + floatEquals(u_endianness, BIG_ENDIAN) * texelOne.abgr;

	// denormalize texel data
	texelOne = 255.0 * reorderedOne;
	texelTwo = 255.0 * reorderedTwo;

	// initialize flipped texel
	vec4 flippedOne = floatEquals(u_mode, PASSTHROUGH) * texelOne.rgba;
	vec4 flippedTwo = floatEquals(u_mode, PASSTHROUGH) * texelTwo.rgba;

	// determine if we should flip the bits or not
	float signBitIsSet = floatGreaterThanOrEqual(floor(texelTwo.a), 128.0);

	// for integers just flip the sign bit
	flippedOne.r += floatEquals(u_mode, INTEGER) * texelOne.r;
	flippedOne.g += floatEquals(u_mode, INTEGER) * texelOne.g;
	flippedOne.b += floatEquals(u_mode, INTEGER) * texelOne.b;
	flippedOne.a += floatEquals(u_mode, INTEGER) * texelOne.a;
	flippedTwo.r += floatEquals(u_mode, INTEGER) * texelTwo.r;
	flippedTwo.g += floatEquals(u_mode, INTEGER) * texelTwo.g;
	flippedTwo.b += floatEquals(u_mode, INTEGER) * texelTwo.b;
	flippedTwo.a += floatEquals(u_mode, INTEGER) * floatEquals(signBitIsSet, 0.0) * (texelTwo.a + 128.0)
				  + floatEquals(u_mode, INTEGER) * floatEquals(signBitIsSet, 1.0) * (texelTwo.a - 128.0);

	// NOTE: to untransform floats we must invert the logic seen in `transform.frag`
	// for floats flip only sign bit if the sign bit WAS already set - otherwise flip all of the bits
	flippedOne.r += floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 1.0) * texelOne.r
				  + floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 0.0) * (255.0 - texelOne.r);
	flippedOne.g += floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 1.0) * texelOne.g
			      + floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 0.0) * (255.0 - texelOne.g);
	flippedOne.b += floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 1.0) * texelOne.b
			      + floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 0.0) * (255.0 - texelOne.b);
	flippedOne.a += floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 1.0) * texelOne.a
			      + floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 0.0) * (255.0 - texelOne.a);
	flippedTwo.r += floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 1.0) * texelTwo.r
				  + floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 0.0) * (255.0 - texelTwo.r);
	flippedTwo.g += floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 1.0) * texelTwo.g
			      + floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 0.0) * (255.0 - texelTwo.g);
	flippedTwo.b += floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 1.0) * texelTwo.b
			      + floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 0.0) * (255.0 - texelTwo.b);
	flippedTwo.a += floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 1.0) * (texelTwo.a - 128.0)
			      + floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 0.0) * (255.0 - texelTwo.a);

	// output denormalized bytes
	gl_FragColor = floatEquals(floor(mod(floor(gl_FragCoord.x), 2.0)), 0.0) * (flippedOne.rgba / 255.0)
				 + floatEquals(floor(mod(floor(gl_FragCoord.x), 2.0)), 1.0) * (flippedTwo.rgba / 255.0);
}