/**

NAME
====

Joose.Manual.MethodModifiers - Joose's method modifiers


WHAT IS A METHOD MODIFIER?
==========================

Joose provides a feature called "method modifiers". You can also think of these as "hooks" or "advice".

It's probably easiest to understand this feature with a few examples:

Class('Person', {
    
    methods : {
        eat : function (food) {
            console.log('yummy')
            
            return 'yummy'
        }
    }
})

Class('TidyPerson', {
    isa : Person,
    
    before : {
        eat : function (food) {
            this.washHands()
        }
    },
    
    after : {
        eat : function (food) {
            this.brushTeeth()
        }
    },
    
    methods : {
        washHands : function (food) {
            console.log('washing hands')
        },
        
        brushTeeth : function (food) {
            console.log('brushing teeth')
        }
    }
})

Now if I call new TidyPerson().eat('apple') I'll get the following output:

    washing hands
    yummy
    brushing teeth

You probably could have figured that out from the names "before" and "after"

Method modifiers are applied in the order they appears in the class's declaration. 

**NOTE FOR RHINO USERS:**
Since Rhino travers object properties in random order, if you'll provide more than one modifier for some method in a class, you may receive ambigous results.

WHY USE THEM?
=============

Method modifiers have many uses. One very common use is in roles. This lets roles alter the behavior of methods in the classes that use them. See [Joose.Manual.Roles][1] for more information about roles.

Since modifiers are mostly useful in roles, some of the examples below are a bit artificial. They're intended to give you an idea of how modifiers work, but may not be the most natural usage.


BEFORE and AFTER
================

These method modifiers can be used to adjust the behavior of some method, usually inherited from superclass, or defined in the consuming class (in case of Roles).
In both cases the returning value still returns from original method, not from modifier. Return values of modifiers are ignored.

Using the declaration above:

    var tidyPerson = new TidyPerson()
    var res = tidyPerson.eat('apple')
    
    console.log(res == 'yummy') # returns 'yummy'

Another use for the before modifier would be to do some sort of prechecking on a method call or setter. For example:

    Class('Bus', {
        isa : Vehicle,
        
        before : {
            openDoors : function () {
                if (this.isMoving()) throw "Can't open the bus's doors during movement"
            }
        }
    })

This lets us implement logical checks that don't make sense as type constraints. In particular, they're useful for defining logical rules about an object's state changes.

Similarly, an after modifier could be used for logging an action that was taken, and so on.


OVERRIDE and AROUND
===================

An 'override' and 'around' modifiers are a bit more powerful than either a 'before' or 'after' modifier. It can modify the arguments being passed to the original method, 
and you can even decide to simply not call the original method at all. You can also modify the return value of the original method.

Class('Person', {
    have : {
        firstName : null,
        lastName : null
    },
    
    methods : {
        getDisplayName : function (lastNameFirst) {
            if (lastNameFirst) return this.lastName + ', ' + this.firstName  
            
            return this.firstName + ' ' + this.lastName
        },
        
        chatOnIRC : function (partner, message) {
            this.type(partner + ': ' + message 
        }
    }
})


Class('Employee', {
    isa : Person,
    
    has : {
        jobTitle : { is : 'rw' }
    },

    override : {
        getDisplayName : function (lastNameFirst) {
            return this.SUPER(false) + ', ' + this.jobTitle 
        }
    },
    
    around : {
        chatOnIRC : function (original, partner, message) {
            this.type(partner + ': ' + message 
        }
    }
    
})


The call to super() is almost the same as calling $self->SUPER.display_name. The difference is that the arguments passed to the superclass's method will always be the same as the ones passed to the method modifier, and cannot be changed.

All arguments passed to super() are ignored, as are any changes made to @_ before super() is called.





An around modifier receives the original method as its first argument, then the object, and finally any arguments passed to the method.

  around 'size' => sub {
      my $orig = shift;
      my $self = shift;

      return $self->$orig()
          unless @_;

      my $size = shift;
      $size = $size / 2
          if $self->likes_small_things();

      return $self->$orig($size);
  };

INNER AND AUGMENT ^

Augment and inner are two halves of the same feature. The augment modifier provides a sort of inverted subclassing. You provide part of the implementation in a superclass, and then document that subclasses are expected to provide the rest.

The superclass calls inner(), which then calls the augment modifier in the subclass:

  package Document;

  use Joose;

  sub as_xml {
      my $self = shift;

      my $xml = "<document>\n";
      $xml .= inner();
      $xml .= "</document>\n";

      return $xml;
  }

Using inner() in this method makes it possible for one or more subclasses to then augment this method with their own specific implementation:

  package Report;

  use Joose;

  extends 'Document';

  augment 'as_xml' => sub {
      my $self = shift;

      my $xml = "<report>\n";
      $xml .= inner();
      $xml .= "</report>\n";

      return $xml;
  };

When we call as_xml on a Report object, we get something like this:

  <document>
  <report>
  </report>
  </document>

But we also called inner() in Report, so we can continue subclassing and adding more content inside the document:

  package Report.IncomeAndExpenses;

  use Joose;

  extends 'Report';

  augment 'as_xml' => sub {
      my $self = shift;

      my $xml = '<income>' . $self->income . '</income>';
      $xml .= "\n";
      $xml .= '<expenses>' . $self->expenses . '</expenses>';
      $xml .= "\n";

      $xml .= inner() || q{};

      return $xml;
  };

Now our report has some content:

  <document>
  <report>
  <income>$10</income>
  <expenses>$8</expenses>
  </report>
  </document>

What makes this combination of augment and inner() special is that it allows us to have methods which are called from parent (least specific) to child (most specific). This inverts the normal inheritance pattern.

Note that in Report.IncomeAndExpenses we call inner() again. If the object is an instance of Report.IncomeAndExpenses then this call is a no-op, and just returns false.




AUTHOR
======

Nickolay Platonov <nickolay8@gmail.com>

Heavily based on the original content of Moose::Manual, by Dave Rolsky <autarch@urth.org>


COPYRIGHT AND LICENSE
=====================

Copyright (c) 2008, Malte Ubl

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Malte Ubl nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 

[Joose.Manual.Roles][1]

*/