/*
 * Copyright 2011-2012, 2014 pooler@litecoinpool.org
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR AND CONTRIBUTORS ``AS IS'' AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 * OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 */

#include "cpuminer-config.h"

#if defined(__linux__) && defined(__ELF__)
	.section .note.GNU-stack,"",%progbits
#endif

#if defined(USE_ASM) && defined(__i386__)
	
.macro scrypt_shuffle src, so, dest, do
	movl	\so+60(\src), %eax
	movl	\so+44(\src), %ebx
	movl	\so+28(\src), %ecx
	movl	\so+12(\src), %edx
	movl	%eax, \do+12(\dest)
	movl	%ebx, \do+28(\dest)
	movl	%ecx, \do+44(\dest)
	movl	%edx, \do+60(\dest)
	movl	\so+40(\src), %eax
	movl	\so+8(\src), %ebx
	movl	\so+48(\src), %ecx
	movl	\so+16(\src), %edx
	movl	%eax, \do+8(\dest)
	movl	%ebx, \do+40(\dest)
	movl	%ecx, \do+16(\dest)
	movl	%edx, \do+48(\dest)
	movl	\so+20(\src), %eax
	movl	\so+4(\src), %ebx
	movl	\so+52(\src), %ecx
	movl	\so+36(\src), %edx
	movl	%eax, \do+4(\dest)
	movl	%ebx, \do+20(\dest)
	movl	%ecx, \do+36(\dest)
	movl	%edx, \do+52(\dest)
	movl	\so+0(\src), %eax
	movl	\so+24(\src), %ebx
	movl	\so+32(\src), %ecx
	movl	\so+56(\src), %edx
	movl	%eax, \do+0(\dest)
	movl	%ebx, \do+24(\dest)
	movl	%ecx, \do+32(\dest)
	movl	%edx, \do+56(\dest)
.endm

.macro salsa8_core_gen_quadround
	movl	52(%esp), %ecx
	movl	4(%esp), %edx
	movl	20(%esp), %ebx
	movl	8(%esp), %esi
	leal	(%ecx, %edx), %edi
	roll	$7, %edi
	xorl	%edi, %ebx
	movl	%ebx, 4(%esp)
	movl	36(%esp), %edi
	leal	(%edx, %ebx), %ebp
	roll	$9, %ebp
	xorl	%ebp, %edi
	movl	24(%esp), %ebp
	movl	%edi, 8(%esp)
	addl	%edi, %ebx
	roll	$13, %ebx
	xorl	%ebx, %ecx
	movl	40(%esp), %ebx
	movl	%ecx, 20(%esp)
	addl	%edi, %ecx
	roll	$18, %ecx
	leal	(%esi, %ebp), %edi
	roll	$7, %edi
	xorl	%edi, %ebx
	movl	%ebx, 24(%esp)
	movl	56(%esp), %edi
	xorl	%ecx, %edx
	leal	(%ebp, %ebx), %ecx
	roll	$9, %ecx
	xorl	%ecx, %edi
	movl	%edi, 36(%esp)
	movl	28(%esp), %ecx
	movl	%edx, 28(%esp)
	movl	44(%esp), %edx
	addl	%edi, %ebx
	roll	$13, %ebx
	xorl	%ebx, %esi
	movl	60(%esp), %ebx
	movl	%esi, 40(%esp)
	addl	%edi, %esi
	roll	$18, %esi
	leal	(%ecx, %edx), %edi
	roll	$7, %edi
	xorl	%edi, %ebx
	movl	%ebx, 44(%esp)
	movl	12(%esp), %edi
	xorl	%esi, %ebp
	leal	(%edx, %ebx), %esi
	roll	$9, %esi
	xorl	%esi, %edi
	movl	%edi, 12(%esp)
	movl	48(%esp), %esi
	movl	%ebp, 48(%esp)
	movl	64(%esp), %ebp
	addl	%edi, %ebx
	roll	$13, %ebx
	xorl	%ebx, %ecx
	movl	16(%esp), %ebx
	movl	%ecx, 16(%esp)
	addl	%edi, %ecx
	roll	$18, %ecx
	leal	(%esi, %ebp), %edi
	roll	$7, %edi
	xorl	%edi, %ebx
	movl	32(%esp), %edi
	xorl	%ecx, %edx
	leal	(%ebp, %ebx), %ecx
	roll	$9, %ecx
	xorl	%ecx, %edi
	movl	%edi, 32(%esp)
	movl	%ebx, %ecx
	movl	%edx, 52(%esp)
	movl	28(%esp), %edx
	addl	%edi, %ebx
	roll	$13, %ebx
	xorl	%ebx, %esi
	movl	40(%esp), %ebx
	movl	%esi, 28(%esp)
	addl	%edi, %esi
	roll	$18, %esi
	leal	(%ecx, %edx), %edi
	roll	$7, %edi
	xorl	%edi, %ebx
	movl	%ebx, 40(%esp)
	movl	12(%esp), %edi
	xorl	%esi, %ebp
	leal	(%edx, %ebx), %esi
	roll	$9, %esi
	xorl	%esi, %edi
	movl	%edi, 12(%esp)
	movl	4(%esp), %esi
	movl	%ebp, 4(%esp)
	movl	48(%esp), %ebp
	addl	%edi, %ebx
	roll	$13, %ebx
	xorl	%ebx, %ecx
	movl	16(%esp), %ebx
	movl	%ecx, 16(%esp)
	addl	%edi, %ecx
	roll	$18, %ecx
	leal	(%esi, %ebp), %edi
	roll	$7, %edi
	xorl	%edi, %ebx
	movl	%ebx, 48(%esp)
	movl	32(%esp), %edi
	xorl	%ecx, %edx
	leal	(%ebp, %ebx), %ecx
	roll	$9, %ecx
	xorl	%ecx, %edi
	movl	%edi, 32(%esp)
	movl	24(%esp), %ecx
	movl	%edx, 24(%esp)
	movl	52(%esp), %edx
	addl	%edi, %ebx
	roll	$13, %ebx
	xorl	%ebx, %esi
	movl	28(%esp), %ebx
	movl	%esi, 28(%esp)
	addl	%edi, %esi
	roll	$18, %esi
	leal	(%ecx, %edx), %edi
	roll	$7, %edi
	xorl	%edi, %ebx
	movl	%ebx, 52(%esp)
	movl	8(%esp), %edi
	xorl	%esi, %ebp
	leal	(%edx, %ebx), %esi
	roll	$9, %esi
	xorl	%esi, %edi
	movl	%edi, 8(%esp)
	movl	44(%esp), %esi
	movl	%ebp, 44(%esp)
	movl	4(%esp), %ebp
	addl	%edi, %ebx
	roll	$13, %ebx
	xorl	%ebx, %ecx
	movl	20(%esp), %ebx
	movl	%ecx, 4(%esp)
	addl	%edi, %ecx
	roll	$18, %ecx
	leal	(%esi, %ebp), %edi
	roll	$7, %edi
	xorl	%edi, %ebx
	movl	36(%esp), %edi
	xorl	%ecx, %edx
	leal	(%ebp, %ebx), %ecx
	roll	$9, %ecx
	xorl	%ecx, %edi
	movl	%edi, 20(%esp)
	movl	%ebx, %ecx
	movl	%edx, 36(%esp)
	movl	24(%esp), %edx
	addl	%edi, %ebx
	roll	$13, %ebx
	xorl	%ebx, %esi
	movl	28(%esp), %ebx
	movl	%esi, 24(%esp)
	addl	%edi, %esi
	roll	$18, %esi
	leal	(%ecx, %edx), %edi
	roll	$7, %edi
	xorl	%edi, %ebx
	movl	%ebx, 28(%esp)
	xorl	%esi, %ebp
	movl	8(%esp), %esi
	leal	(%edx, %ebx), %edi
	roll	$9, %edi
	xorl	%edi, %esi
	movl	40(%esp), %edi
	movl	%ebp, 8(%esp)
	movl	44(%esp), %ebp
	movl	%esi, 40(%esp)
	addl	%esi, %ebx
	roll	$13, %ebx
	xorl	%ebx, %ecx
	movl	4(%esp), %ebx
	movl	%ecx, 44(%esp)
	addl	%esi, %ecx
	roll	$18, %ecx
	leal	(%edi, %ebp), %esi
	roll	$7, %esi
	xorl	%esi, %ebx
	movl	%ebx, 4(%esp)
	movl	20(%esp), %esi
	xorl	%ecx, %edx
	leal	(%ebp, %ebx), %ecx
	roll	$9, %ecx
	xorl	%ecx, %esi
	movl	%esi, 56(%esp)
	movl	48(%esp), %ecx
	movl	%edx, 20(%esp)
	movl	36(%esp), %edx
	addl	%esi, %ebx
	roll	$13, %ebx
	xorl	%ebx, %edi
	movl	24(%esp), %ebx
	movl	%edi, 24(%esp)
	addl	%esi, %edi
	roll	$18, %edi
	leal	(%ecx, %edx), %esi
	roll	$7, %esi
	xorl	%esi, %ebx
	movl	%ebx, 60(%esp)
	movl	12(%esp), %esi
	xorl	%edi, %ebp
	leal	(%edx, %ebx), %edi
	roll	$9, %edi
	xorl	%edi, %esi
	movl	%esi, 12(%esp)
	movl	52(%esp), %edi
	movl	%ebp, 36(%esp)
	movl	8(%esp), %ebp
	addl	%esi, %ebx
	roll	$13, %ebx
	xorl	%ebx, %ecx
	movl	16(%esp), %ebx
	movl	%ecx, 16(%esp)
	addl	%esi, %ecx
	roll	$18, %ecx
	leal	(%edi, %ebp), %esi
	roll	$7, %esi
	xorl	%esi, %ebx
	movl	32(%esp), %esi
	xorl	%ecx, %edx
	leal	(%ebp, %ebx), %ecx
	roll	$9, %ecx
	xorl	%ecx, %esi
	movl	%esi, 32(%esp)
	movl	%ebx, %ecx
	movl	%edx, 48(%esp)
	movl	20(%esp), %edx
	addl	%esi, %ebx
	roll	$13, %ebx
	xorl	%ebx, %edi
	movl	24(%esp), %ebx
	movl	%edi, 20(%esp)
	addl	%esi, %edi
	roll	$18, %edi
	leal	(%ecx, %edx), %esi
	roll	$7, %esi
	xorl	%esi, %ebx
	movl	%ebx, 8(%esp)
	movl	12(%esp), %esi
	xorl	%edi, %ebp
	leal	(%edx, %ebx), %edi
	roll	$9, %edi
	xorl	%edi, %esi
	movl	%esi, 12(%esp)
	movl	28(%esp), %edi
	movl	%ebp, 52(%esp)
	movl	36(%esp), %ebp
	addl	%esi, %ebx
	roll	$13, %ebx
	xorl	%ebx, %ecx
	movl	16(%esp), %ebx
	movl	%ecx, 16(%esp)
	addl	%esi, %ecx
	roll	$18, %ecx
	leal	(%edi, %ebp), %esi
	roll	$7, %esi
	xorl	%esi, %ebx
	movl	%ebx, 28(%esp)
	movl	32(%esp), %esi
	xorl	%ecx, %edx
	leal	(%ebp, %ebx), %ecx
	roll	$9, %ecx
	xorl	%ecx, %esi
	movl	%esi, 32(%esp)
	movl	4(%esp), %ecx
	movl	%edx, 4(%esp)
	movl	48(%esp), %edx
	addl	%esi, %ebx
	roll	$13, %ebx
	xorl	%ebx, %edi
	movl	20(%esp), %ebx
	movl	%edi, 20(%esp)
	addl	%esi, %edi
	roll	$18, %edi
	leal	(%ecx, %edx), %esi
	roll	$7, %esi
	xorl	%esi, %ebx
	movl	%ebx, 48(%esp)
	movl	40(%esp), %esi
	xorl	%edi, %ebp
	leal	(%edx, %ebx), %edi
	roll	$9, %edi
	xorl	%edi, %esi
	movl	%esi, 36(%esp)
	movl	60(%esp), %edi
	movl	%ebp, 24(%esp)
	movl	52(%esp), %ebp
	addl	%esi, %ebx
	roll	$13, %ebx
	xorl	%ebx, %ecx
	movl	44(%esp), %ebx
	movl	%ecx, 40(%esp)
	addl	%esi, %ecx
	roll	$18, %ecx
	leal	(%edi, %ebp), %esi
	roll	$7, %esi
	xorl	%esi, %ebx
	movl	%ebx, 52(%esp)
	movl	56(%esp), %esi
	xorl	%ecx, %edx
	leal	(%ebp, %ebx), %ecx
	roll	$9, %ecx
	xorl	%ecx, %esi
	movl	%esi, 56(%esp)
	addl	%esi, %ebx
	movl	%edx, 44(%esp)
	roll	$13, %ebx
	xorl	%ebx, %edi
	movl	%edi, 60(%esp)
	addl	%esi, %edi
	roll	$18, %edi
	xorl	%edi, %ebp
	movl	%ebp, 64(%esp)
.endm

	.text
	.p2align 5
salsa8_core_gen:
	salsa8_core_gen_quadround
	salsa8_core_gen_quadround
	ret
	
	
	.text
	.p2align 5
	.globl scrypt_core
	.globl _scrypt_core
scrypt_core:
_scrypt_core:
	pushl	%ebx
	pushl	%ebp
	pushl	%edi
	pushl	%esi
	
	/* Check for SSE2 availability */
	movl	$1, %eax
	cpuid
	andl	$0x04000000, %edx
	jnz scrypt_core_sse2
	
scrypt_core_gen:
	movl	20(%esp), %edi
	movl	24(%esp), %esi
	movl	28(%esp), %ecx
	subl	$72, %esp
	
.macro scrypt_core_macro1a p, q
	movl	\p(%edi), %eax
	movl	\q(%edi), %edx
	movl	%eax, \p(%esi)
	movl	%edx, \q(%esi)
	xorl	%edx, %eax
	movl	%eax, \p(%edi)
	movl	%eax, \p(%esp)
.endm
	
.macro scrypt_core_macro1b p, q
	movl	\p(%edi), %eax
	xorl	\p(%esi, %edx), %eax
	movl	\q(%edi), %ebx
	xorl	\q(%esi, %edx), %ebx
	movl	%ebx, \q(%edi)
	xorl	%ebx, %eax
	movl	%eax, \p(%edi)
	movl	%eax, \p(%esp)
.endm
	
.macro scrypt_core_macro2 p, q
	movl	\p(%esp), %eax
	addl	\p(%edi), %eax
	movl	%eax, \p(%edi)
	xorl	\q(%edi), %eax
	movl	%eax, \q(%edi)
	movl	%eax, \p(%esp)
.endm
	
.macro scrypt_core_macro3 p, q
	movl	\p(%esp), %eax
	addl	\q(%edi), %eax
	movl	%eax, \q(%edi)
.endm
	
	shll	$7, %ecx
	addl	%esi, %ecx
scrypt_core_gen_loop1:
	movl	%esi, 64(%esp)
	movl	%ecx, 68(%esp)
	
	scrypt_core_macro1a	0, 64
	scrypt_core_macro1a	4, 68
	scrypt_core_macro1a	8, 72
	scrypt_core_macro1a	12, 76
	scrypt_core_macro1a	16, 80
	scrypt_core_macro1a	20, 84
	scrypt_core_macro1a	24, 88
	scrypt_core_macro1a	28, 92
	scrypt_core_macro1a	32, 96
	scrypt_core_macro1a	36, 100
	scrypt_core_macro1a	40, 104
	scrypt_core_macro1a	44, 108
	scrypt_core_macro1a	48, 112
	scrypt_core_macro1a	52, 116
	scrypt_core_macro1a	56, 120
	scrypt_core_macro1a	60, 124
	
	call salsa8_core_gen
	
	movl	92(%esp), %edi
	scrypt_core_macro2	0, 64
	scrypt_core_macro2	4, 68
	scrypt_core_macro2	8, 72
	scrypt_core_macro2	12, 76
	scrypt_core_macro2	16, 80
	scrypt_core_macro2	20, 84
	scrypt_core_macro2	24, 88
	scrypt_core_macro2	28, 92
	scrypt_core_macro2	32, 96
	scrypt_core_macro2	36, 100
	scrypt_core_macro2	40, 104
	scrypt_core_macro2	44, 108
	scrypt_core_macro2	48, 112
	scrypt_core_macro2	52, 116
	scrypt_core_macro2	56, 120
	scrypt_core_macro2	60, 124
	
	call salsa8_core_gen
	
	movl	92(%esp), %edi
	scrypt_core_macro3	0, 64
	scrypt_core_macro3	4, 68
	scrypt_core_macro3	8, 72
	scrypt_core_macro3	12, 76
	scrypt_core_macro3	16, 80
	scrypt_core_macro3	20, 84
	scrypt_core_macro3	24, 88
	scrypt_core_macro3	28, 92
	scrypt_core_macro3	32, 96
	scrypt_core_macro3	36, 100
	scrypt_core_macro3	40, 104
	scrypt_core_macro3	44, 108
	scrypt_core_macro3	48, 112
	scrypt_core_macro3	52, 116
	scrypt_core_macro3	56, 120
	scrypt_core_macro3	60, 124
	
	movl	64(%esp), %esi
	movl	68(%esp), %ecx
	addl	$128, %esi
	cmpl	%ecx, %esi
	jne scrypt_core_gen_loop1

	movl	96(%esp), %esi
	movl	100(%esp), %ecx
	movl	%ecx, %eax
	subl	$1, %eax
	movl	%eax, 100(%esp)
scrypt_core_gen_loop2:
	movl	%ecx, 68(%esp)
	
	movl	64(%edi), %edx
	andl	100(%esp), %edx
	shll	$7, %edx
	
	scrypt_core_macro1b	0, 64
	scrypt_core_macro1b	4, 68
	scrypt_core_macro1b	8, 72
	scrypt_core_macro1b	12, 76
	scrypt_core_macro1b	16, 80
	scrypt_core_macro1b	20, 84
	scrypt_core_macro1b	24, 88
	scrypt_core_macro1b	28, 92
	scrypt_core_macro1b	32, 96
	scrypt_core_macro1b	36, 100
	scrypt_core_macro1b	40, 104
	scrypt_core_macro1b	44, 108
	scrypt_core_macro1b	48, 112
	scrypt_core_macro1b	52, 116
	scrypt_core_macro1b	56, 120
	scrypt_core_macro1b	60, 124
	
	call salsa8_core_gen
	
	movl	92(%esp), %edi
	scrypt_core_macro2	0, 64
	scrypt_core_macro2	4, 68
	scrypt_core_macro2	8, 72
	scrypt_core_macro2	12, 76
	scrypt_core_macro2	16, 80
	scrypt_core_macro2	20, 84
	scrypt_core_macro2	24, 88
	scrypt_core_macro2	28, 92
	scrypt_core_macro2	32, 96
	scrypt_core_macro2	36, 100
	scrypt_core_macro2	40, 104
	scrypt_core_macro2	44, 108
	scrypt_core_macro2	48, 112
	scrypt_core_macro2	52, 116
	scrypt_core_macro2	56, 120
	scrypt_core_macro2	60, 124
	
	call salsa8_core_gen
	
	movl	92(%esp), %edi
	movl	96(%esp), %esi
	scrypt_core_macro3	0, 64
	scrypt_core_macro3	4, 68
	scrypt_core_macro3	8, 72
	scrypt_core_macro3	12, 76
	scrypt_core_macro3	16, 80
	scrypt_core_macro3	20, 84
	scrypt_core_macro3	24, 88
	scrypt_core_macro3	28, 92
	scrypt_core_macro3	32, 96
	scrypt_core_macro3	36, 100
	scrypt_core_macro3	40, 104
	scrypt_core_macro3	44, 108
	scrypt_core_macro3	48, 112
	scrypt_core_macro3	52, 116
	scrypt_core_macro3	56, 120
	scrypt_core_macro3	60, 124
	
	movl	68(%esp), %ecx
	subl	$1, %ecx
	ja scrypt_core_gen_loop2
	
	addl	$72, %esp
	popl	%esi
	popl	%edi
	popl	%ebp
	popl	%ebx
	ret


.macro salsa8_core_sse2_doubleround
	movdqa	%xmm1, %xmm4
	paddd	%xmm0, %xmm4
	movdqa	%xmm4, %xmm5
	pslld	$7, %xmm4
	psrld	$25, %xmm5
	pxor	%xmm4, %xmm3
	movdqa	%xmm0, %xmm4
	pxor	%xmm5, %xmm3
	
	paddd	%xmm3, %xmm4
	movdqa	%xmm4, %xmm5
	pslld	$9, %xmm4
	psrld	$23, %xmm5
	pxor	%xmm4, %xmm2
	movdqa	%xmm3, %xmm4
	pxor	%xmm5, %xmm2
	pshufd	$0x93, %xmm3, %xmm3
	
	paddd	%xmm2, %xmm4
	movdqa	%xmm4, %xmm5
	pslld	$13, %xmm4
	psrld	$19, %xmm5
	pxor	%xmm4, %xmm1
	movdqa	%xmm2, %xmm4
	pxor	%xmm5, %xmm1
	pshufd	$0x4e, %xmm2, %xmm2
	
	paddd	%xmm1, %xmm4
	movdqa	%xmm4, %xmm5
	pslld	$18, %xmm4
	psrld	$14, %xmm5
	pxor	%xmm4, %xmm0
	movdqa	%xmm3, %xmm4
	pxor	%xmm5, %xmm0
	pshufd	$0x39, %xmm1, %xmm1
	
	paddd	%xmm0, %xmm4
	movdqa	%xmm4, %xmm5
	pslld	$7, %xmm4
	psrld	$25, %xmm5
	pxor	%xmm4, %xmm1
	movdqa	%xmm0, %xmm4
	pxor	%xmm5, %xmm1
	
	paddd	%xmm1, %xmm4
	movdqa	%xmm4, %xmm5
	pslld	$9, %xmm4
	psrld	$23, %xmm5
	pxor	%xmm4, %xmm2
	movdqa	%xmm1, %xmm4
	pxor	%xmm5, %xmm2
	pshufd	$0x93, %xmm1, %xmm1
	
	paddd	%xmm2, %xmm4
	movdqa	%xmm4, %xmm5
	pslld	$13, %xmm4
	psrld	$19, %xmm5
	pxor	%xmm4, %xmm3
	movdqa	%xmm2, %xmm4
	pxor	%xmm5, %xmm3
	pshufd	$0x4e, %xmm2, %xmm2
	
	paddd	%xmm3, %xmm4
	movdqa	%xmm4, %xmm5
	pslld	$18, %xmm4
	psrld	$14, %xmm5
	pxor	%xmm4, %xmm0
	pshufd	$0x39, %xmm3, %xmm3
	pxor	%xmm5, %xmm0
.endm

.macro salsa8_core_sse2
	salsa8_core_sse2_doubleround
	salsa8_core_sse2_doubleround
	salsa8_core_sse2_doubleround
	salsa8_core_sse2_doubleround
.endm
	
	.p2align 5
scrypt_core_sse2:
	movl	20(%esp), %edi
	movl	24(%esp), %esi
	movl	%esp, %ebp
	subl	$128, %esp
	andl	$-16, %esp
	
	scrypt_shuffle %edi, 0, %esp, 0
	scrypt_shuffle %edi, 64, %esp, 64
	
	movdqa	96(%esp), %xmm6
	movdqa	112(%esp), %xmm7
	
	movl	%esi, %edx
	movl	28(%ebp), %ecx
	shll	$7, %ecx
	addl	%esi, %ecx
scrypt_core_sse2_loop1:
	movdqa	0(%esp), %xmm0
	movdqa	16(%esp), %xmm1
	movdqa	32(%esp), %xmm2
	movdqa	48(%esp), %xmm3
	movdqa	64(%esp), %xmm4
	movdqa	80(%esp), %xmm5
	pxor	%xmm4, %xmm0
	pxor	%xmm5, %xmm1
	movdqa	%xmm0, 0(%edx)
	movdqa	%xmm1, 16(%edx)
	pxor	%xmm6, %xmm2
	pxor	%xmm7, %xmm3
	movdqa	%xmm2, 32(%edx)
	movdqa	%xmm3, 48(%edx)
	movdqa	%xmm4, 64(%edx)
	movdqa	%xmm5, 80(%edx)
	movdqa	%xmm6, 96(%edx)
	movdqa	%xmm7, 112(%edx)
	
	salsa8_core_sse2
	paddd	0(%edx), %xmm0
	paddd	16(%edx), %xmm1
	paddd	32(%edx), %xmm2
	paddd	48(%edx), %xmm3
	movdqa	%xmm0, 0(%esp)
	movdqa	%xmm1, 16(%esp)
	movdqa	%xmm2, 32(%esp)
	movdqa	%xmm3, 48(%esp)
	
	pxor	64(%esp), %xmm0
	pxor	80(%esp), %xmm1
	pxor	%xmm6, %xmm2
	pxor	%xmm7, %xmm3
	movdqa	%xmm0, 64(%esp)
	movdqa	%xmm1, 80(%esp)
	movdqa	%xmm2, %xmm6
	movdqa	%xmm3, %xmm7
	salsa8_core_sse2
	paddd	64(%esp), %xmm0
	paddd	80(%esp), %xmm1
	paddd	%xmm2, %xmm6
	paddd	%xmm3, %xmm7
	movdqa	%xmm0, 64(%esp)
	movdqa	%xmm1, 80(%esp)
	
	addl	$128, %edx
	cmpl	%ecx, %edx
	jne scrypt_core_sse2_loop1
	
	movdqa	64(%esp), %xmm4
	movdqa	80(%esp), %xmm5
	
	movl	28(%ebp), %ecx
	movl	%ecx, %eax
	subl	$1, %eax
scrypt_core_sse2_loop2:
	movd	%xmm4, %edx
	movdqa	0(%esp), %xmm0
	movdqa	16(%esp), %xmm1
	movdqa	32(%esp), %xmm2
	movdqa	48(%esp), %xmm3
	andl	%eax, %edx
	shll	$7, %edx
	pxor	0(%esi, %edx), %xmm0
	pxor	16(%esi, %edx), %xmm1
	pxor	32(%esi, %edx), %xmm2
	pxor	48(%esi, %edx), %xmm3
	
	pxor	%xmm4, %xmm0
	pxor	%xmm5, %xmm1
	movdqa	%xmm0, 0(%esp)
	movdqa	%xmm1, 16(%esp)
	pxor	%xmm6, %xmm2
	pxor	%xmm7, %xmm3
	movdqa	%xmm2, 32(%esp)
	movdqa	%xmm3, 48(%esp)
	salsa8_core_sse2
	paddd	0(%esp), %xmm0
	paddd	16(%esp), %xmm1
	paddd	32(%esp), %xmm2
	paddd	48(%esp), %xmm3
	movdqa	%xmm0, 0(%esp)
	movdqa	%xmm1, 16(%esp)
	movdqa	%xmm2, 32(%esp)
	movdqa	%xmm3, 48(%esp)
	
	pxor	64(%esi, %edx), %xmm0
	pxor	80(%esi, %edx), %xmm1
	pxor	96(%esi, %edx), %xmm2
	pxor	112(%esi, %edx), %xmm3
	pxor	64(%esp), %xmm0
	pxor	80(%esp), %xmm1
	pxor	%xmm6, %xmm2
	pxor	%xmm7, %xmm3
	movdqa	%xmm0, 64(%esp)
	movdqa	%xmm1, 80(%esp)
	movdqa	%xmm2, %xmm6
	movdqa	%xmm3, %xmm7
	salsa8_core_sse2
	paddd	64(%esp), %xmm0
	paddd	80(%esp), %xmm1
	paddd	%xmm2, %xmm6
	paddd	%xmm3, %xmm7
	movdqa	%xmm0, %xmm4
	movdqa	%xmm1, %xmm5
	movdqa	%xmm0, 64(%esp)
	movdqa	%xmm1, 80(%esp)
	
	subl	$1, %ecx
	ja scrypt_core_sse2_loop2
	
	movdqa	%xmm6, 96(%esp)
	movdqa	%xmm7, 112(%esp)
	
	scrypt_shuffle %esp, 0, %edi, 0
	scrypt_shuffle %esp, 64, %edi, 64
	
	movl	%ebp, %esp
	popl	%esi
	popl	%edi
	popl	%ebp
	popl	%ebx
	ret

#endif
