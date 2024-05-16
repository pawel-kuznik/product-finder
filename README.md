# product-finder

This library is a small helper library that allows me to scan webstored for products
and create lists of their products. The main reason why this library exists is that
webstores don't have a public APIs, but sometimes I want to get some data from them.
Luckily, a lot of webstores annotate their pages with schema.org metadata which contains
a lot of information that I would like to get from the webstores.

The main part of the library is the `Source` class which represents a webstore or other
product source. Internally it can process the source by fetching websites from it and
parsing received data. It tries to not put too much load on the receiving end by making
the calls in stepping manner: one after another one with a delay in between. This is
mainly cause many of the stores are hosted on minimal hardware and it would be very
unpolite to DDoS then while getting the data.

The `Source` class also provides the found product information, discovered links,
and organization data. From this point the greater system (one that uses this library),
can make further actions.