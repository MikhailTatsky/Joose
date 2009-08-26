/**

NAME
====

Joose.Manual.Singleton - Singleton pattern, "out of the box"

WHAT IS A SINGLETON?
====================

Singleton is a class, which has only a single instance. It often manage some system-wide state or set of helper functions.


SYNTAX
======

To declare a singleton use `my` builder:

        Class('TypeRegistry', {
        
            my : {
                has : {
                    types : Joose.Object
                },
                
                does : [ JooseX.Storable ],
                
                methods : {
                    registerType : function (type, value) {
                        ....
                    }
                }
            }
        })

You may use any usual builders inside of `my`, including method modifires, `isa`, `does`, etc. Instance of singleton class will be created right before class declaration.
To access it, use `my` property of class's constructor, like
        
        TypeRegistry.my.registerType('textfield', Ext.form.TextField) 


In Joose, singletons are "attached" to usual classes. This means you can define a usual class with the same name just fine: 

        Class('TypeRegistry', {
            
            has : {
                someAttribute : { is : 'rw' }
            },
            
            ....
        
            my : {
                has : {
                    types : Joose.Object
                },
                
                ....
            }
        })

However, this may easily lead to ambiguity, so you should clearly understand what are you doing. 


SINGLETON INHERITANCE
=====================

Singletons may inherit from other classes in various ways

Direct inheritance
------------------

You may use `isa` builder to directly specify from which class your singleton should inherit:

        Class('TypeRegistry', {
        
            my : {
                isa : Registry,
                
                ....
            }
        })

Direct inheritance has a highest priority.


Indirect inheritance via usual class
------------------------------------

Joose's singletons are also inheritable as some kind of special "attributes". This mean, that subclasses of class with attached singleton will also have a subclass of that singleton attached :) For example:

        Class('Registry', {
        
            my : {
                ....
            }
        })

        Class('TypeRegistry', {
            isa : Registry
        })

`TypeRegistry` will inherit all the attributes of `Registry`, including a singleton, which will be accessible as `TypeRegistry.my`. Note however, that a new instance of singleton class will be instantiated.   

You may also specify any additional builders, which will customize the singleton's subclass: 

        Class('TypeRegistry', {
            isa : Registry,
            
            my : {
                override : {
                    registerType : function (type, value) {
                        ....
                    }
                }
            }
        })

Indirect inheritance can be also written in "direct" form, which requires some basic knowledge of Joose internals:

        Class('TypeRegistry', {
            my : {
                isa : Registry.my.meta.c
            }
        })
        
        
ROLES WITH SINGLETONS
=====================
        
In addition to all this singletons wizardry you may create a special, "singleton" roles:

        Role('TypeRegistry.Storable', {
        
            my : {
                has : {
                    storageId : { is : 'rw' }
                },
                
                override : {
                    registerType : function (type, value) {
                        ....
                    }
                }
            }
        })
        
Such roles should be applied in "indirect form", to the usual class, which will contains the singleton being modified.

        Class('TypeRegistry', {
            
            does : TypeRegistry.Storable
        })
        
The "direct" form of this example:

        Class('TypeRegistry', {
            
            my : {
                does : TypeRegistry.Storable.my.meta.c,
                
                ....
            }
        })


AUTHOR
======

Nickolay Platonov [nickolay8@gmail.com](mailto:nickolay8@gmail.com)


COPYRIGHT AND LICENSE
=====================

Copyright (c) 2008, Malte Ubl

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Malte Ubl nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 


*/