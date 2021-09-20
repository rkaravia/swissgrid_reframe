# swissgrid_reframe

**JavaScript library for transforming coordinates between the Swiss projected coordinate systems (LV03 and LV95).**

[LV03](https://www.swisstopo.admin.ch/en/knowledge-facts/surveying-geodesy/reference-frames/local/lv03.html)
is the old reference frame derived from triangulation and was used in Switzerland until 2016.
LV03 coordinates are by convention designated by the letters `y` for the easting and `x` for the northing,
with origin at `y = 600 000 m` / `x = 200 000 m`. The origin is not at `0 / 0` to avoid confusion between
easting and northing, this is sometimes called "false easting" and "false northing".

[LV95](https://www.swisstopo.admin.ch/en/knowledge-facts/surveying-geodesy/reference-frames/local/lv95.html)
is the new reference frame derived from GNSS surveying and is used in Switzerland since 2016.
LV95 coordinates are by convention designated by the letters `E` for the easting and `N` for the northing,
with origin at `E = 2 600 000 m` / `N = 1 200 000 m`. This still avoids confusion between easting and northing,
and the additional `2 000 000 m` / `1 000 000 m` offset also avoids confusion with LV03.

Due to local distortions of the LV03 reference frame, coordinates in LV03 and LV95 can differ by up to
1.6 meters. Swisstopo provides a dataset of triangles (CHENyx06) for local affine transformations to model
these distortions which the swissgrid_reframe library uses to transform between LV03 and LV95.

See
[Swisstopo reference document about Swiss projected coordinate systems](https://www.swisstopo.admin.ch/content/swisstopo-internet/en/online/calculation-services/_jcr_content/contentPar/tabs/items/documents_publicatio/tabPar/downloadlist/downloadItems/20_1467104436749.download/refsys_e.pdf)
for more information.

## Usage

```js
import { lv03_to_lv95, lv95_to_lv03 } from "swissgrid_reframe";

lv03_to_lv95([722758.81, 87649.67]); 
// Result: [2722759.06, 1087648.19]

lv95_to_lv03([2722759.06, 1087648.19]);
// Result: [722758.81, 87649.67]
```

## License

See [LICENSE.txt](./LICENSE.txt).

## See also

### Similar software

The following software also uses CHENyx06 to transform between LV03 and LV95:

- [GeoSuite](https://www.swisstopo.admin.ch/en/geodata/applications/geosoftware/geosuite.html): Windows software
- [REFRAME DLL / JAR](https://www.swisstopo.admin.ch/en/geodata/applications/geosoftware/dll.html): .NET / Java libraries
- [REFRAME web service](https://www.swisstopo.admin.ch/en/maps-data-online/calculation-services/m2m.html): Based on REFRAME DLL, see example calls below
   - https://geodesy.geo.admin.ch/reframe/lv03tolv95?easting=722758.81&northing=87649.67
   - https://geodesy.geo.admin.ch/reframe/lv95tolv03?easting=2722759.06&northing=1087648.19

Swisstopo also provides an NTv2 grid for transformations between LV03 and LV95:

- [Swisstopo NTv2 grid](https://www.swisstopo.admin.ch/en/knowledge-facts/surveying-geodesy/reference-frames/transformations-position.html)

Note that this has slightly lower precision than the CHENyx06-based transformations.

### References

- [Swisstopo reference document about Swiss projected coordinate systems](https://www.swisstopo.admin.ch/content/swisstopo-internet/en/online/calculation-services/_jcr_content/contentPar/tabs/items/documents_publicatio/tabPar/downloadlist/downloadItems/20_1467104436749.download/refsys_e.pdf)
- [Usage of PROJ at swisstopo](http://www.euref.eu/documentation/Tutorial2019/t-06-Brockmann.pdf)
- [Neue Koordinaten für die Schweiz - Der Bezugsrahmen LV95](https://www.swisstopo.admin.ch/content/swisstopo-internet/de/topics/survey/reference-frames/_jcr_content/contentPar/tabs/items/193_1607528867523/tabPar/downloadlist_copy/downloadItems/65_1607429169239.download/Brosch_LV95_dt_www.pdf)
