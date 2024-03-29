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
    float ascendingGroupBool = floatLessThan(floor(gl_FragCoord.y), floor(descendingStartCoord.y));
    ascendingGroupBool      += floatEquals(floor(gl_FragCoord.y), floor(descendingStartCoord.y)) *
                               floatLessThan(floor(gl_FragCoord.x), floor(descendingStartCoord.x));
    float firstTexelBool     = floatLessThan(floor(gl_FragCoord.y), floor(blockMiddleCoord.y));
    firstTexelBool          += floatEquals(floor(gl_FragCoord.y), floor(blockMiddleCoord.y)) *
                               floatLessThan(floor(gl_FragCoord.x), floor(blockMiddleCoord.x));

    // get current data
    vec4 localData = texture2D(u_bytes, vec2(gl_FragCoord.xy) / u_width);

    // get peer data
    vec2 peerFragCoord = floatEquals(firstTexelBool, 1.0) * (gl_FragCoord.xy + halfBlockOffset)
                       + floatEquals(firstTexelBool, 0.0) * (gl_FragCoord.xy - halfBlockOffset);
    vec4 peerData = texture2D(u_bytes, vec2(peerFragCoord.xy) / u_width);

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
    gl_FragColor = floatEquals(notSwapBool, 1.0) * localData.rgba
                 + floatEquals(notSwapBool, 0.0) * peerData.rgba;
}
